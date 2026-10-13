<h1>Lyft Track</h1>
<p><i>A local-first, offline workout tracker mobile app designed for convenience and simplicity.</i></p>

<h2>Overview</h2>
<p>Built with modern <strong>React Native</strong> tools, Lyft Track allows users to log workouts, track sets, and view their training history entirely on their device without the need for cloud or user accounts.</p>

<h2>Core Features</h2>
<ul>
  <li><strong>Interactive Calendar Dashboard:</strong> Users open the app to a dynamic calendar home screen that visually highlights the days they have trained.</li>
  <li><strong>Local-First Architecture:</strong> Powered by an embedded SQLite database, the app works flawlessly without an internet connection.</li>
  <li><strong>Personalized Exercise Vocabulary:</strong> Instead of relying on a predetermined list, users generate and name their own <i>custom exercises</i> ("Flat Bench Press") for a personalized tracking experience.</li>
  <li><strong>Detailed Set Logging:</strong> Track exact reps and precise decimal weights (<i>kg/lbs</i>) for every exercise.</li>
  <li><strong>Full CRUD Capabilities:</strong> Tap on any past date to view completed routines, or use the dynamic edit screen to delete and update past workout logs seamlessly.</li>
</ul>

<h2>Technical Stack</h2>
<ul>
  <li><strong>Framework:</strong> React Native / Expo</li>
  <li><strong>Language:</strong> TypeScript</li>
  <li><strong>Navigation:</strong> Expo Router (<i>File-based routing</i>)</li>
  <li><strong>Database Engine:</strong> Expo SQLite</li>
  <li><strong>ORM:</strong> Drizzle ORM (<i>For strict TypeScript database models</i>)</li>
  <li><strong>UI Components:</strong> react-native-calendars</li>
</ul>

<h2>Project Architecture</h2>
<p>The codebase cleanly separates the user interface from the database logic to ensure maintainability:</p>
<ul>
  <li><strong>app/</strong> (<i>Navigation Layer</i>): Handles the Expo Router screens. index.tsx serves as the calendar home screen, while dynamic routes like workout/[date].tsx, workout/new.tsx, and workout/edit.tsx manage the workout views and forms.</li>
  <li><strong>src/db/</strong> (<i>Data Layer</i>): Isolates the database configuration. database.ts establishes the local SQLite connection, and schema.ts defines the Drizzle ORM tables (<i>workouts, exercises, sets</i>).</li>
  <li><strong>src/hooks/</strong> (<i>The Bridge</i>): Contains custom hooks (e.g., useWorkoutDates, useSaveWorkout, useUpdateWorkout) that fetch and format SQLite data for the UI components.</li>
  <li><strong>src/types/</strong>: Defines complex, nested TypeScript interfaces (like FullWorkoutDetails) that combine database rows for the UI.</li>
</ul>

<h2>Getting Started</h2>
<p><i>Ensure you have Node.js installed and an Expo-compatible emulator or the Expo Go app on your physical device.</i></p>

<h3>1. Clone and Navigate</h3>
<pre><code>git clone &lt;https://github.com/ReapNoo/lyft-track-app&gt;
cd workout-tracker</code></pre>

<h3>2. Install Dependencies</h3>
<pre><code>npm install
npx expo install expo-sqlite expo-router react-native-safe-area-context react-native-screens
npm install drizzle-orm react-native-calendars</code></pre>

<h3>3. Start the Server</h3>
<pre><code>npx expo start</code></pre>

<h2>Future Roadmap</h2>
<ul>
  <li><strong>Exercise Tags:</strong> Implement tags for custom exercises (<i>"Push", "Pull", or target muscle groups</i>) to allow for advanced filtering and grouping.</li>
  <li><strong>Metrics & Analytics:</strong> Expand the dashboard overview to track streaks, volume charts, and personal records.</li>
</ul>
