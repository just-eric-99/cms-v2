import { DataTable } from '@/components/table/data-table.tsx'

import { Center } from '@/network/centers/types.ts'
import CreateCenterPage from '@/pages/Center/Create'
import {columns} from "@/pages/Organization/Details/centers/_table/columns.tsx";

type OrganizationDetailsCenterSummaryProps = {
  centerSummary: Center[]
  organizationId: string
}
export default function OrganizationDetailsCenterSummary(
  props: OrganizationDetailsCenterSummaryProps
) {
  return (
    <DataTable
      columns={columns}
      data={props.centerSummary}
      navigationPath={'/centers'}
      createComponent={
        <CreateCenterPage preDefinedOrganizationId={props.organizationId} />
      }
    />
  )
}
