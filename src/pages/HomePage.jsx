import Layout from '../components/Layout'
import './HomePage.css'

export default function HomePage() {
  return (
    <Layout>
      <div className="home-content">
        <p className="home-para">
          Welcome to <strong>TaskMaster</strong> — your cyberpunk-grade productivity hub built for the mercenaries of the modern age. In Night City, every second counts. Here, so do your tasks.
        </p>
        <p className="home-para">
          This application was designed to solve the chaos that plagues every solo operative: too many jobs, too little structure. TaskMaster gives you a single, clean interface to track everything you need to do — from the small errands to the high-stakes missions.
        </p>
        <p className="home-para">
          Create tasks, monitor their progress, and mark them complete as you go. Your pending jobs stay visible so nothing slips through the cracks. Completed tasks are archived for your review. Every day, a counter tracks how many you've closed — your daily edge count.
        </p>
        <p className="home-para">
          Use the navigation above to jump between your task lists. Need help or want to reach the team? Hit <strong>Contact Us</strong>. Now jack in — there's work to be done.
        </p>
      </div>
    </Layout>
  )
}
