import CardBox from '../components/cardbox/CardBox.jsx'
import {
  getMyTicketActivities,
  getMyTicketsOverviewCards,
  getMyTicketsWorkspaceItems,
} from '../services/mytickets/MyTickets.js'

function MyTickets({ activePage, activePath, lastUpdated, searchQuery }) {
  const overviewCards = getMyTicketsOverviewCards(activePage)
  const activities = getMyTicketActivities()
  const workspaceItems = getMyTicketsWorkspaceItems({
    activePath,
    lastUpdated,
    searchQuery,
  })

  return (
    <>
      <section className="dashboard-overview" aria-label="Ringkasan My Tickets">
        {overviewCards.map((card) => (
          <CardBox
            key={card.title}
            eyebrow={card.eyebrow}
            value={card.value}
            detail={card.detail}
            state={card.state}
          />
        ))}
      </section>

      <section className="dashboard-grid" aria-label="Aktivitas legal">
        <article className="dashboard-panel">
          <div className="dashboard-panel__header">
            <p className="dashboard-panel__eyebrow">Current View</p>
            <h1 className="dashboard-panel__title">{activePage.title}</h1>
          </div>

          <div className="dashboard-stack">
            {activities.map((activity) => (
              <div className="dashboard-stack__item" key={activity.title}>
                <h2 className="dashboard-stack__title">{activity.title}</h2>
                <p className="dashboard-stack__text">{activity.description}</p>
              </div>
            ))}
          </div>
        </article>

        <aside className="dashboard-panel">
          <div className="dashboard-panel__header">
            <p className="dashboard-panel__eyebrow">Workspace</p>
            <h2 className="dashboard-panel__title">Status</h2>
          </div>

          <ul className="dashboard-list">
            {workspaceItems.map((item) => (
              <li className="dashboard-list__item" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </>
  )
}

export default MyTickets
