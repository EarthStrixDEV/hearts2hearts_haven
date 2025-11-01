export default function SchedulePage() {
  const upcomingEvents = [
    {
      date: "Oct 26, 2025",
      time: "5:00 PM KST",
      event: "Music Bank Performance",
      location: "KBS, Seoul",
      type: "Performance",
      status: "Upcoming",
      emoji: "🎤",
    },
    {
      date: "Oct 30, 2025",
      time: "11:59 PM KST",
      event: "MAMA Voting Deadline",
      location: "Online",
      type: "Voting",
      status: "Deadline",
      emoji: "🗳️",
    },
    {
      date: "Nov 2, 2025",
      time: "3:00 PM KST",
      event: "Show Champion",
      location: "MBC, Seoul",
      type: "Performance",
      status: "Upcoming",
      emoji: "🏆",
    },
    {
      date: "Nov 5, 2025",
      time: "6:00 PM KST",
      event: "Inkigayo",
      location: "SBS, Seoul",
      type: "Performance",
      status: "Upcoming",
      emoji: "🎵",
    },
    {
      date: "Nov 10, 2025",
      time: "TBA",
      event: "Fan Meeting - FOCUS ERA",
      location: "Olympic Park, Seoul",
      type: "Fan Event",
      status: "Coming Soon",
      emoji: "💕",
    },
  ];

  const pastEvents = [
    {
      date: "Oct 25, 2025",
      event: "Music Core - FOCUS",
      description:
        "Iconic pink ballet performance! Carmen's ending fairy went viral!",
      emoji: "🩰",
    },
    {
      date: "Oct 20, 2025",
      event: "FOCUS Comeback Showcase",
      description: "Mini-album release showcase with all members present",
      emoji: "🎪",
    },
    {
      date: "Oct 19, 2025",
      event: "V LIVE Comeback Countdown",
      description: "Special live stream before FOCUS release",
      emoji: "📱",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
            Schedule & Events
          </h1>
          <p className="text-xl text-gray-600">
            Never miss a H2H moment! Mark your calendars, S2U! 💕
          </p>
        </div>

        {/* Important Reminder */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-6 rounded-3xl shadow-xl mb-12 text-center">
          <h2 className="text-2xl font-bold mb-2">⏰ Important Reminder!</h2>
          <p className="text-lg">
            MAMA Voting ends October 30th, 2025! Don't forget to vote for H2H!
            🗳️
          </p>
          <a
            href="https://mama.vote"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 bg-white text-blue-500 px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all"
          >
            Vote Now →
          </a>
        </div>

        {/* Upcoming Events */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 gradient-text text-center">
            Upcoming Events
          </h2>

          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="card-pastel p-6 hover:shadow-2xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-5xl">{event.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-800">
                          {event.event}
                        </h3>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            event.status === "Deadline"
                              ? "bg-red-100 text-red-600"
                              : event.status === "Upcoming"
                              ? "bg-green-100 text-green-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-gray-600">
                        <p className="flex items-center gap-2">
                          <span className="text-blue-500">📅</span>
                          <strong>{event.date}</strong>
                          {event.time !== "TBA" && ` at ${event.time}`}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-blue-500">📍</span>
                          {event.location}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-blue-500">🏷️</span>
                          {event.type}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button className="btn-pastel whitespace-nowrap">
                      Add to Calendar 📲
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Events */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 gradient-text text-center">
            Recent Past Events 📝
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {pastEvents.map((event, index) => (
              <div key={index} className="card-pastel p-6">
                <div className="text-5xl mb-4 text-center">{event.emoji}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                  {event.event}
                </h3>
                <p className="text-sm text-blue-600 mb-3 text-center">
                  {event.date}
                </p>
                <p className="text-gray-600 text-sm text-center">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="card-pastel p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 gradient-text text-center">
            Weekly Music Show Schedule 📺
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-blue-600 mb-4">
                Weekday Shows
              </h3>
              <ul className="space-y-3">
                <li className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">
                    Tuesday - The Show
                  </span>
                  <span className="text-sm text-gray-500">6:00 PM KST</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">
                    Wednesday - Show Champion
                  </span>
                  <span className="text-sm text-gray-500">6:00 PM KST</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">
                    Thursday - M Countdown
                  </span>
                  <span className="text-sm text-gray-500">6:00 PM KST</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">
                    Friday - Music Bank
                  </span>
                  <span className="text-sm text-gray-500">5:00 PM KST</span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-purple-600 mb-4">
                Weekend Shows
              </h3>
              <ul className="space-y-3">
                <li className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">
                    Saturday - Music Core
                  </span>
                  <span className="text-sm text-gray-500">3:15 PM KST</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">
                    Sunday - Inkigayo
                  </span>
                  <span className="text-sm text-gray-500">3:50 PM KST</span>
                </li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                💡 H2H doesn't appear on every show every week. Check for
                official announcements!
              </p>
            </div>
          </div>
        </div>

        {/* Embed Google Calendar */}
        <div className="card-pastel p-8">
          <h2 className="text-3xl font-bold mb-6 gradient-text text-center">
            H2H Calendar 🗓️
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Subscribe to never miss an update! All times in KST.
          </p>

          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Google Calendar Integration
            </h3>
            <p className="text-gray-600 mb-6">
              Add H2H's schedule to your Google Calendar to get notifications
              for every event!
            </p>
            <button className="btn-pastel">Subscribe to Calendar 🔔</button>
            <p className="text-sm text-gray-500 mt-4">
              Calendar includes performances, voting deadlines, and fan events
            </p>
          </div>
        </div>

        {/* Time Zone Converter */}
        <div className="mt-8 bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-center mb-3 text-gray-800">
            🌏 International S2U Time Zone Reference
          </h3>
          <p className="text-center text-gray-600 text-sm mb-4">
            All times shown are KST (Korea Standard Time). Convert to your local
            time!
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white px-4 py-2 rounded-lg">
              <strong>KST:</strong> UTC+9
            </div>
            <div className="bg-white px-4 py-2 rounded-lg">
              <strong>Jakarta:</strong> -2 hours
            </div>
            <div className="bg-white px-4 py-2 rounded-lg">
              <strong>Vancouver:</strong> -16 hours
            </div>
            <div className="bg-white px-4 py-2 rounded-lg">
              <strong>EST:</strong> -14 hours
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
