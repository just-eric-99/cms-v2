import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Controller, useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label.tsx'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { getAllCenters } from '@/network/centers/api.ts'
import { useQuery } from '@tanstack/react-query'
import { getAllUserGroup } from '@/network/user-groups/api.ts'
import { getAllOrganization } from '@/network/organization/api.ts'
import Loader from '@/components/loader.tsx'

type UserDetailsFormProps = {
  canEdit: boolean
}
export default function UserDetailsForm({ canEdit }: UserDetailsFormProps) {
  const form = useFormContext()

  const organizationQuery = useQuery({
    queryKey: ['organizations'],
    queryFn: getAllOrganization,
  })

  const centerQuery = useQuery({
    queryKey: ['centers'],
    queryFn: getAllCenters,
  })

  const userGroupQuery = useQuery({
    queryKey: ['user-groups'],
    queryFn: getAllUserGroup,
  })

  if (
    centerQuery.isLoading ||
    organizationQuery.isLoading ||
    userGroupQuery.isLoading
  ) {
    return <Loader />
  }

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
                <Input
                  {...field}
                  placeholder='e.g. 陳大文'
                  disabled={!canEdit}
                />
              </FormControl>
              <FormMessage className='col-span-5 col-start-3' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='displayName'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <FormLabel className='col-span-2'>Display Name</FormLabel>
              <FormControl className='col-span-5'>
                <Input
                  {...field}
                  placeholder='e.g. Chan Tai Man'
                  disabled={!canEdit}
                />
              </FormControl>
              <FormMessage className='col-span-5 col-start-3' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <FormLabel className='col-span-2'>Email</FormLabel>
              <FormControl className='col-span-5'>
                <Input {...field} placeholder='e.g. chantaiman@email.com' disabled={!canEdit} />
              </FormControl>
              <FormMessage className='col-span-5 col-start-3' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <FormLabel className='col-span-2'>Phone</FormLabel>
              <FormControl className='col-span-5'>
                <Input {...field} placeholder='e.g. +85212345678' disabled={!canEdit} />
              </FormControl>
              <FormMessage className='col-span-5 col-start-3' />
            </FormItem>
          )}
        />

        <Controller
          control={form.control}
          name='organizationId'
          render={({ field, fieldState }) => {
            return (
              <FormControl>
                <FormItem>
                  <Label className={fieldState.error && 'text-destructive'}>
                    Organisation
                  </Label>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={canEdit != undefined && !canEdit}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select Organisation' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {organizationQuery.data?.map((org) => (
                          <SelectItem value={org.id} key={org.id}>
                            {org.name}
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
            )
          }}
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
                  value={field.value}
                  disabled={!canEdit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select Center' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {centerQuery.data
                        ?.filter((center) => {
                          if (!form.watch('organizationId')) return false
                          return (
                            form.watch('organizationId') ===
                            center.organizationId
                          )
                        })
                        ?.map((center) => (
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

        <Controller
          control={form.control}
          name='userGroupId'
          render={({ field, fieldState }) => (
            <FormControl>
              <FormItem>
                <Label className={fieldState.error && 'text-destructive'}>
                  User Group
                </Label>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!canEdit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select User Group' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {userGroupQuery.data
                        ?.filter((userGroup) => {
                          if (!form.getValues('centerId')) return false
                          return form.getValues('centerId') === userGroup.centerId
                        })
                        ?.map((userGroup) => (
                          <SelectItem value={userGroup.id} key={userGroup.id}>
                            {userGroup.name}
                          </SelectItem>
                        ))}
                      {/*  todo: usergroup query */}
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
      </div>
    </Form>
  )
}
