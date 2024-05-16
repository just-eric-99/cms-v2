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
import { z } from 'zod'
import { createAdminSchema } from '@/pages/Admin/_data/schema.ts'
import { getAllCenters } from '@/network/centers/api.ts'
import { useQuery } from '@tanstack/react-query'
import { getAllRoles } from '@/network/roles/api.ts'

export default function AdminCreateForm() {
  const form = useFormContext<z.infer<typeof createAdminSchema>>()
  const centerQuery = useQuery({
    queryKey: ['centers'],
    queryFn: async () => getAllCenters(),
  })

  const roleQuery = useQuery({
    queryKey: ['roles'],
    queryFn: async () => getAllRoles(),
  })
  return (
    <Form {...form}>
      <div className='flex flex-1 flex-col justify-start gap-5'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <FormLabel className='col-span-2'>Chinese Name</FormLabel>
              <FormControl className='col-span-5'>
                <Input {...field} placeholder='chinese name' />
              </FormControl>
              <FormMessage className='col-span-5 col-start-3' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='nameEn'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <FormLabel className='col-span-2'>English Name</FormLabel>
              <FormControl className='col-span-5'>
                <Input {...field} placeholder='english name' />
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
                <Input {...field} placeholder='display name' />
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
                <Input {...field} placeholder='email' />
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
                <Input {...field} placeholder='phone' />
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
                <Select onValueChange={field.onChange} value={field.value}>
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

        <Controller
          control={form.control}
          name='roleId'
          render={({ field, fieldState }) => (
            <FormControl>
              <FormItem>
                <Label className={fieldState.error && 'text-destructive'}>
                  Role
                </Label>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select Role' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {roleQuery.data?.map((role) => (
                        <SelectItem value={role.id} key={role.id}>
                          {role.title}
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
