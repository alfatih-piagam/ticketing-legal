import { useState } from 'react'

import ButtonRangeDate from '../../components/button/ButtonRangeDate.jsx'
import { Ticket01 } from '../../components/template/TemplateIcons.jsx'
import DataTableMT from './DataTableMT.jsx'
import DialogCreateTicket from './DialogCreateTicket.jsx'

function MyTickets({ activePage, searchQuery }) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  })

  return (
    <>
      <section
        className="dashboard-panel users-table-card mytickets-table-card"
        aria-label="Aktivitas legal"
      >
        <div className="users-table-card__header">
          <div>
            <h1 className="dashboard-panel__title">{activePage?.title ?? 'MyTickets'}</h1>
          </div>

          <div className="users-table-card__actions">
            <ButtonRangeDate label="Request Date" onChange={setDateRange} />

            <button
              type="button"
              className="users-table-card__action"
              onClick={() => setIsCreateDialogOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isCreateDialogOpen}
            >
              <Ticket01 size={18} aria-hidden="true" />
              <span>Create Tickets</span>
            </button>
          </div>
        </div>

        <DataTableMT
          dateRange={dateRange}
          searchQuery={searchQuery}
          tableLabel={`${activePage?.title ?? 'MyTickets'} table`}
        />
      </section>

      <DialogCreateTicket
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </>
  )
}

export default MyTickets
