import { useEffect, useMemo, useState } from 'react'

import DataTable, {
  DataTableIdentity,
  DataTableStatus,
} from '../../components/table/DataTable.jsx'
import { Edit03, Trash03 } from '../../components/template/TemplateIcons.jsx'

const PAGE_SIZE_OPTIONS = [5, 10, 15]
const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0]
const EMPTY_DATE_RANGE = {
  startDate: '',
  endDate: '',
}
const INDONESIAN_MONTHS = {
  januari: 0,
  februari: 1,
  maret: 2,
  april: 3,
  mei: 4,
  juni: 5,
  juli: 6,
  agustus: 7,
  september: 8,
  oktober: 9,
  november: 10,
  desember: 11,
}

const ticketRows = [
  {
    id: 'LGL-001',
    category: 'Contract',
    requestor: 'Nadia Putri',
    issue: 'Permintaan revisi klausul terminasi pada vendor agreement regional.',
    requestDate: '05 Mei 2026',
    status: 'Waiting',
    supportName: 'Alya Pratama',
    supportRole: 'Head of Legal',
    solution: 'Review redline dan finalisasi wording terminasi yang lebih aman.',
  },
  {
    id: 'LGL-002',
    category: 'Compliance',
    requestor: 'Rizky Ananta',
    issue: 'Permohonan validasi dokumen due diligence untuk onboarding partner baru.',
    requestDate: '04 Mei 2026',
    status: 'In Progress',
    supportName: 'Bima Saputra',
    supportRole: 'Senior Legal Counsel',
    solution: 'Checklist compliance sedang diverifikasi bersama tim procurement.',
  },
  {
    id: 'LGL-003',
    category: 'Litigation',
    requestor: 'Maya Lestari',
    issue: 'Permintaan analisis risiko atas somasi dari mitra distribusi.',
    requestDate: '03 Mei 2026',
    status: 'Feedback',
    supportName: 'Dio Mahendra',
    supportRole: 'Litigation Specialist',
    solution: 'Menunggu kronologi tambahan dan dokumen pendukung dari business owner.',
  },
  {
    id: 'LGL-004',
    category: 'Corporate',
    requestor: 'Kevin Hartono',
    issue: 'Perubahan struktur penandatanganan untuk addendum kerja sama operasional.',
    requestDate: '02 Mei 2026',
    status: 'Resolved',
    supportName: 'Clara Wijaya',
    supportRole: 'Corporate Legal Officer',
    solution: 'Addendum final sudah disetujui dan siap ditandatangani para pihak.',
  },
  {
    id: 'LGL-005',
    category: 'Advisory',
    requestor: 'Tania Kusuma',
    issue: 'Permintaan opini legal untuk skema promosi bersama pihak ketiga.',
    requestDate: '01 Mei 2026',
    status: 'In Progress',
    supportName: 'Evelyn Santoso',
    supportRole: 'Compliance Analyst',
    solution: 'Draft legal opinion sedang dirapikan dengan fokus pada batas eksposur risiko.',
  },
]

function getStatusVariant(status) {
  if (status === 'Waiting') {
    return 'pending'
  }

  if (status === 'In Progress' || status === 'Resolved') {
    return 'active'
  }

  if (status === 'Feedback') {
    return 'app'
  }

  return 'inactive'
}

function matchesSearch(ticket, searchQuery) {
  const normalizedQuery = searchQuery.trim().toLowerCase()

  if (!normalizedQuery) {
    return true
  }

  return [
    ticket.id,
    ticket.category,
    ticket.requestor,
    ticket.issue,
    ticket.requestDate,
    ticket.status,
    ticket.supportName,
    ticket.supportRole,
    ticket.solution,
  ].some((value) => String(value).toLowerCase().includes(normalizedQuery))
}

function parseInputDate(value) {
  const [year, month, day] = String(value).split('-').map(Number)

  if (!year || !month || !day) {
    return null
  }

  const date = new Date(year, month - 1, day)

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null
  }

  return date
}

function parseTicketRequestDate(value) {
  const [dayValue, monthLabel, yearValue] = String(value).trim().split(/\s+/)
  const day = Number(dayValue)
  const year = Number(yearValue)
  const month = INDONESIAN_MONTHS[monthLabel?.toLowerCase()]

  if (!day || !year || month === undefined) {
    return null
  }

  const date = new Date(year, month, day)

  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null
  }

  return date
}

function matchesDateRange(ticket, range) {
  if (!range.startDate || !range.endDate) {
    return true
  }

  const startDate = parseInputDate(range.startDate)
  const endDate = parseInputDate(range.endDate)

  if (!startDate || !endDate) {
    return true
  }

  const ticketDate = parseTicketRequestDate(ticket.requestDate)

  if (!ticketDate) {
    return false
  }

  const ticketTime = ticketDate.getTime()

  return ticketTime >= startDate.getTime() && ticketTime <= endDate.getTime()
}

const columns = [
  {
    key: 'category',
    header: 'Category',
    accessor: 'category',
    cellStyle: { whiteSpace: 'nowrap', width: '12%' },
  },
  {
    key: 'issue',
    header: 'Masalah',
    accessor: 'issue',
    cellStyle: { minWidth: '320px' },
  },
  {
    key: 'requestDate',
    header: 'Request Date',
    accessor: 'requestDate',
    cellStyle: { whiteSpace: 'nowrap', width: '12%' },
  },
  {
    key: 'status',
    header: 'Status',
    cellStyle: { whiteSpace: 'nowrap', width: '12%' },
    render: (ticket) => (
      <DataTableStatus inline variant={getStatusVariant(ticket.status)}>
        {ticket.status}
      </DataTableStatus>
    ),
  },
  {
    key: 'support',
    header: 'Support',
    cellStyle: { minWidth: '220px' },
    render: (ticket) => (
      <DataTableIdentity title={ticket.supportName} subtitle={ticket.supportRole} />
    ),
  },
  {
    key: 'solution',
    header: 'Solution',
    accessor: 'solution',
    cellStyle: { minWidth: '300px' },
  },
]

function getTicketDetailItems(ticket) {
  return [
    { label: 'Category', value: ticket.category },
    { label: 'Request Date', value: ticket.requestDate },
    { label: 'Requestor', value: ticket.requestor },
  ]
}

const tableActions = [
  {
    key: 'edit',
    label: 'Edit',
    icon: Edit03,
    onClick: () => {},
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: Trash03,
    variant: 'danger',
    onClick: () => {},
  },
]

function getPaginationItems(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 'end-ellipsis', totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, 'start-ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, 'start-ellipsis', currentPage - 1, currentPage, currentPage + 1, 'end-ellipsis', totalPages]
}

function DataTableMT({
  searchQuery = '',
  tableLabel = 'MyTickets table',
  dateRange = EMPTY_DATE_RANGE,
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const filteredRows = useMemo(
    () =>
      ticketRows.filter(
        (ticket) => matchesSearch(ticket, searchQuery) && matchesDateRange(ticket, dateRange),
      ),
    [dateRange, searchQuery],
  )
  const hasActiveDateFilter = Boolean(dateRange.startDate && dateRange.endDate)
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const currentPageStart = (safeCurrentPage - 1) * pageSize
  const rows = filteredRows.slice(currentPageStart, currentPageStart + pageSize)
  const firstItem = filteredRows.length === 0 ? 0 : currentPageStart + 1
  const lastItem =
    filteredRows.length === 0 ? 0 : Math.min(currentPageStart + rows.length, filteredRows.length)

  useEffect(() => {
    setCurrentPage(1)
  }, [dateRange.endDate, dateRange.startDate, pageSize, searchQuery])

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages))
  }, [totalPages])

  const pagination = {
    summary:
      filteredRows.length === 0
        ? '0 dari 0 tiket'
        : `${firstItem}-${lastItem} dari ${filteredRows.length} tiket`,
    currentPage: safeCurrentPage,
    totalPages,
    items: getPaginationItems(safeCurrentPage, totalPages),
    pageSize,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    pageSizeLabel: 'Tampilkan',
    pageSizeSuffix: 'baris',
    previousLabel: 'Sebelumnya',
    nextLabel: 'Berikutnya',
    ariaLabel: 'MyTickets pagination',
    pageSizeAriaLabel: 'Jumlah baris ticket per halaman',
    onPrevious: () => setCurrentPage((page) => Math.max(1, page - 1)),
    onNext: () => setCurrentPage((page) => Math.min(totalPages, page + 1)),
    onSelect: (page) => setCurrentPage(page),
    onPageSizeChange: (nextPageSize) => setPageSize(nextPageSize),
  }

  return (
    <div className="mtickets-table-shell">
      <DataTable
        className="mtickets-table"
        rows={rows}
        columns={columns}
        getRowId={(ticket) => ticket.id}
        tableLabel={tableLabel}
        detail={{
          columnLabel: 'Detail',
          buttonLabel: 'Detail',
          eyebrow: 'Ticket ID',
          title: (ticket) => ticket.id,
          render: (ticket) => (
            <div className="mtickets-table__detail-summary">
              {getTicketDetailItems(ticket).map((item) => (
                <div key={item.label} className="mtickets-table__detail-item">
                  <p className="mtickets-table__detail-label">{item.label}</p>
                  <p className="mtickets-table__detail-value">{item.value}</p>
                </div>
              ))}
            </div>
          ),
        }}
        actions={tableActions}
        emptyMessage={
          searchQuery || hasActiveDateFilter
            ? 'Tidak ada ticket yang sesuai dengan filter yang dipilih.'
            : 'Belum ada ticket untuk ditampilkan.'
        }
        pagination={pagination}
      />
    </div>
  )
}

export default DataTableMT
