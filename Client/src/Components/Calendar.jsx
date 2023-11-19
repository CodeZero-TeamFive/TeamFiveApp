import { useState, useRef, useEffect } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import useLocalStorage from "../Hooks/useLocalStorage";
import useApi from "../Hooks/useApi";
import useApiWithReturn from "../Hooks/useApiWithReturn";

const styles = {
  wrap: {
    display: "flex"
  },
  left: {
    marginRight: "10px"
  },
  main: {
    flexGrow: "1"
  }
};

const Calendar = () => {
  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useLocalStorage("credentials", {});
  const url = "/api/lesson/user";

  // Still need to add client-side error handling
  const { data, error, handleSubmit } = useApi();
  const { handleSubmit: handleSubmitWithReturn } = useApiWithReturn(); // single-use call to API which doesn't affect data state from useApi()

  const calendarRef = useRef();

  let currentDate = new Date().toJSON().slice(0, 10);

  // If we want to allow users to edit events in any way, use this code and uncomment edit code in context menu below
  const editEvent = async (e) => {
    const dp = calendarRef.current.control;
    const modal = await DayPilot.Modal.prompt("Update event text:", e.text());
    if (!modal.result) { return; }
    e.data.text = modal.result;
    dp.events.update(e);
  };

  const [calendarConfig, setCalendarConfig] = useState({
    viewType: "Week",
    durationBarVisible: false,
    timeRangeSelectedHandling: "Disabled",
    eventMoveHandling: "Disabled",
    eventResizeHandling: "Disabled",
    eventClickHandling: "Disabled",

    // Unnecessary to allow users to create or edit event details on the calendar itself
    // onTimeRangeSelected: async args => {
    //   const dp = calendarRef.current.control;
    //   const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
    //   dp.clearSelection();
    //   if (!modal.result) { return; }
    //   dp.events.add({
    //     start: args.start,
    //     end: args.end,
    //     id: DayPilot.guid(),
    //     text: modal.result
    //   });
    // },
    // onEventClick: async args => {
    //   await editEvent(args.e);
    // },

    contextMenu: new DayPilot.Menu({
      items: [
        {
          text: "Cancel Lesson",
          onClick: async args => {
            // Create warning before user cancels lesson?
            let id = args.source.id();
            const dp = calendarRef.current.control;
            try {
              handleSubmitWithReturn(`/api/lesson/${id}/delete`, {}, "POST");
              dp.events.remove(args.source);
            } catch (err) {
              // Next step: display error for user to see
              console.log(err);
            }
          },
        },
        // {
        //   text: "-"
        // },
        // {
        //   text: "Edit...",
        //   onClick: async args => {
        //     await editEvent(args.source);
        //   }
        // }
      ]
    }),
    onBeforeEventRender: args => {
      args.data.areas = [
        {
          top: 3,
          right: 3,
          width: 20,
          height: 20,
          symbol: "icons/daypilot.svg#minichevron-down-2",
          fontColor: "#fff",
          toolTip: "Show context menu",
          action: "ContextMenu",
        },
        {
          top: 3,
          right: 25,
          width: 20,
          height: 20,
          symbol: "icons/daypilot.svg#x-circle",
          fontColor: "#fff",
          action: "None",
          toolTip: "Delete event",
          onClick: async args => {
            const dp = calendarRef.current.control;
            dp.events.remove(args.source);
          }
        }
      ];

      // Incorporate this code if/when we have picture icons for each user
      // const participants = args.data.participants;
      // if (participants > 0) {
      //   // show one icon for each participant
      //   for (let i = 0; i < participants; i++) {
      //     args.data.areas.push({
      //       bottom: 5,
      //       right: 5 + i * 30,
      //       width: 24,
      //       height: 24,
      //       action: "None",
      //       image: `https://picsum.photos/24/24?random=${i}`,
      //       style: "border-radius: 50%; border: 2px solid #fff; overflow: hidden;",
      //     });
      //   }
      // }
    },
  });

  useEffect(() => {
    // Fetch booked lessons from database
    handleSubmit(url, {}, "GET");
  }, []);

  useEffect(() => {
    console.log(data);
    let events;

    if (data && data.length > 0) {
      // Thinking of a way to implement a loading animation while still rendering calendarRef.current
      setLoading(false);
      events = data.map(lessonsToEvents);
    }

    function lessonsToEvents(lesson) {

      // Color should be changed later to be dependent on teacher or timeslot, instead of random
      let randomColor = `hsla(${~~(360 * Math.random())}, 70%,  72%, 0.8)`

      let event = {
        id: lesson.lessonId,
        text: `${lesson.instrument.name} Lesson with ${lesson.teacher.firstName} ${lesson.teacher.lastName}`,
        start: lesson.start,
        end: lesson.end,
        backColor: randomColor,
        // participants: 2,
      }
      return event;
    }

    const startDate = currentDate;

    calendarRef.current.control.update({ startDate, events });
  }, [data])

  return (
    <div style={styles.wrap}>
      <div style={styles.left}>
        <DayPilotNavigator
          selectMode={"Week"}
          showMonths={1}
          skipMonths={1}
          startDate={currentDate}
          selectionDay={currentDate}
          onTimeRangeSelected={args => {
            calendarRef.current.control.update({
              startDate: args.day
            });
          }}
        />
      </div>
      <div style={styles.main}>
        <DayPilotCalendar
          {...calendarConfig}
          ref={calendarRef}
        />
      </div>
    </div>
  );
}

export default Calendar;