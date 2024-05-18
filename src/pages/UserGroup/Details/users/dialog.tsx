import { Button } from '@/components/ui/button.tsx'
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx'
import { Plus, Trash2 } from 'lucide-react'
import { updateUserGroupSchema } from '@/pages/UserGroup/_data/schema.ts'
import { z } from 'zod'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { getAllUsers } from '@/network/users/api.ts'
import { useQuery } from '@tanstack/react-query'

type UserGroupDetailsUserDialogProps = {
  centerId: string
  canEdit: boolean
}
export default function UserGroupDetailsUserDialog(
  props: UserGroupDetailsUserDialogProps
) {
  const form = useFormContext<z.infer<typeof updateUserGroupSchema>>()
  const userIdsFieldArray = useFieldArray({
    name: 'userIds',
    control: form.control,
  })

  const userQuery = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  })
  return (
    // <Dialog>
    //   <DialogTrigger asChild>
    //     <Button>Modify Users</Button>
    //   </DialogTrigger>
    //   <DialogContent className={'min-w-[1200px]'}>
    //     <DialogHeader></DialogHeader>
    //
    //   </DialogContent>
    // </Dialog>
    <div className={'flex h-96 flex-row gap-2'}>
      <Card className={'flex flex-1 flex-col overflow-y-scroll'}>
        <CardHeader>
          <div className={'text-xl font-bold'}>Available Users</div>
        </CardHeader>
        <CardContent className={'flex flex-col gap-5'}>
          {userQuery.data
            ?.filter(
              (user) =>
                !userIdsFieldArray.fields.find(
                  (field) => field.userId === user.id
                )
            )
            .filter((user) => user.centerId === props.centerId)
            .map((user) => (
              <div
                key={user.id}
                className='flex flex-row items-center justify-between rounded-lg border p-5'
              >
                <div>{user.name}</div>
                <Button
                  disabled={!props.canEdit}
                  size={'icon'}
                  onClick={() => userIdsFieldArray.append({ userId: user.id })}
                >
                  <Plus />
                </Button>
              </div>
            ))}
        </CardContent>
      </Card>
      <div className={'flex flex-1 flex-col'}>
        <Card className={'flex flex-1 flex-col overflow-y-scroll'}>
          <CardHeader>
            <div className={'text-xl font-bold'}>Selected Users</div>
          </CardHeader>
          <CardContent className={'flex flex-col gap-5 '}>
            {userIdsFieldArray.fields.map((field, index) => (
              <div
                key={index}
                className={
                  'flex flex-row items-center justify-between rounded-lg border p-5'
                }
              >
                <div>
                  {userQuery.data
                    ?.filter((user) => user.id === field.userId)
                    .map((user) => <div key={user.id}>{user.name}</div>)}
                </div>
                <Button
                  disabled={!props.canEdit}
                  onClick={() => userIdsFieldArray.remove(index)}
                  size={'icon'}
                  variant={'destructive'}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
