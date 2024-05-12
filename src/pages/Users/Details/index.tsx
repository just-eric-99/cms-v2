import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'

type UserDetailPageProps = {
  editable: boolean
  userId: string
}

export default function UserDetailPage(props: UserDetailPageProps) {
  return (
    <Layout>
      <LayoutHeader>{props.userId}</LayoutHeader>
      <LayoutBody></LayoutBody>
    </Layout>
  )
}
