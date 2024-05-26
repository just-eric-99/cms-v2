import { Controller, useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { updateRoleSchema } from '@/pages/Roles/_data/schema.ts'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { getAllOrganization } from '@/network/organization/api.ts'
import { getAllCenters } from '@/network/centers/api.ts'
import { useQuery } from '@tanstack/react-query'

type RoleDetailsFormProps = {
  canEdit: boolean
}

export default function RoleDetailsForm({ canEdit }: RoleDetailsFormProps) {
  const form = useFormContext<z.infer<typeof updateRoleSchema>>()
  const organizationQuery = useQuery({
    queryKey: ['organizations'],
    queryFn: getAllOrganization,
  })

  const centerQuery = useQuery({
    queryKey: ['centers'],
    queryFn: getAllCenters,
  })
  return (
    <Form {...form}>
      <div className='flex flex-1 flex-col justify-start gap-5'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <FormLabel className='col-span-2'>Title (Chinese)</FormLabel>
              <FormControl className='col-span-5'>
                <Input
                  {...field}
                  placeholder='chinese name'
                  disabled={!canEdit}
                />
              </FormControl>
              <FormMessage className='col-span-5 col-start-3' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='titleEn'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <FormLabel className='col-span-2'>Title (English)</FormLabel>
              <FormControl className='col-span-5'>
                <Input
                  {...field}
                  placeholder='title (english)'
                  disabled={!canEdit}
                />
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
      </div>
    </Form>
  )
}
