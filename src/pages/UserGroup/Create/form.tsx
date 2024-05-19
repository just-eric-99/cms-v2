import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label.tsx'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { useQuery } from '@tanstack/react-query'
import { getAllCenters } from '@/network/centers/api.ts'
import { z } from 'zod'
import { createUserGroupSchema } from '@/pages/UserGroup/_data/schema.ts'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'
import { Button } from '@/components/ui/button.tsx'
import { getAllUsers } from '@/network/users/api.ts'
import { useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card.tsx'
import { Plus, Trash2 } from 'lucide-react'

type UserGroupsCreateFormProps = {
  preDefinedCenterId?: string
}
export default function UserGroupsCreateForm(props: UserGroupsCreateFormProps) {
  const form = useFormContext<z.infer<typeof createUserGroupSchema>>()
  const centerQuery = useQuery({
    queryKey: ['centers'],
    queryFn: getAllCenters,
  })

  const userIdsFieldArray = useFieldArray({
    name: 'userIds',
    control: form.control,
  })

  useEffect(() => {
    userIdsFieldArray.remove()
  }, [form.watch('centerId')])

  const userQuery = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  })

  return (
    <Form {...form}>
      <div className='flex flex-1 flex-col justify-start gap-5'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <FormLabel className='col-span-2'>Name</FormLabel>
              <FormControl className='col-span-5'>
                <Input {...field} placeholder='name' />
              </FormControl>
              <FormMessage className='col-span-5 col-start-3' />
            </FormItem>
          )}
        />
        <Controller
          control={form.control}
          name='centerId'
          render={({ field, fieldState }) => (
            <FormControl>
              <FormItem>
                <Label className={fieldState.error && 'text-destructive'}>
                  Center
                </Label>
                <Select
                  onValueChange={field.onChange}
                  value={props.preDefinedCenterId ?? field.value}
                  disabled={props.preDefinedCenterId !== undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select Center' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {centerQuery.data?.map((center) => (
                        <SelectItem value={center.id} key={center.id}>
                          {center.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage {...field} />

                {fieldState.error && (
                  <p className={'text-sm font-medium text-destructive'}>
                    {fieldState.error?.message}
                  </p>
                )}
              </FormItem>
            </FormControl>
          )}
        />

        <Dialog>
          <DialogTrigger asChild>
            <Button className={form.watch('centerId') === '' ? 'hidden' : ''}>
              Select Users
            </Button>
          </DialogTrigger>
          {form.watch('centerId') !== '' && (
            <FormLabel>
              * Selected {form.watch('userIds').length} user(s)
            </FormLabel>
          )}
          <DialogContent className={'min-w-[1200px]'}>
            <DialogHeader></DialogHeader>
            <div className={'flex h-96 flex-row gap-2'}>
              <Card className={'flex flex-1 flex-col overflow-y-scroll'}>
                <CardHeader>
                  <div className={'text-xl font-bold'}>Available Users</div>
                </CardHeader>
                <CardContent className={'flex flex-col gap-2'}>
                  {userQuery.data
                    ?.filter(
                      (user) =>
                        !userIdsFieldArray.fields.find(
                          (field) => field.userId === user.id
                        )
                    )
                    .filter((user) => user.centerId === form.watch('centerId'))
                    .map((user) => (
                      <div
                        key={user.id}
                        className='flex flex-row items-center justify-between rounded-sm border p-2'
                      >
                        <div>{user.name}</div>
                        <Button
                          size={'icon'}
                          onClick={() =>
                            userIdsFieldArray.append({ userId: user.id })
                          }
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
                  <CardContent className={'flex flex-col gap-2 '}>
                    {userIdsFieldArray.fields.map((field, index) => (
                      <div
                        key={index}
                        className={
                          'flex flex-row items-center justify-between rounded-sm border p-2'
                        }
                      >
                        <div>
                          {userQuery.data
                            ?.filter((user) => user.id === field.userId)
                            .map((user) => <>{user.name}</>)}
                        </div>
                        <Button
                          onClick={() => userIdsFieldArray.remove(index)}
                          size={'icon'}
                          variant={"destructive"}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => form.setValue('userIds', [])}
                variant={'destructive'}
              >
                Clear
              </Button>
              <DialogClose asChild>
                <Button>Done</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Form>
  )
}
