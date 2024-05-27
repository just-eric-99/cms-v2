import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Controller, useFormContext } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { updateCenterSchema } from '../_data/schema'
import { getAllOrganization } from '@/network/organization/api.ts'

type CenterDetailsFormProps = {
  canEdit: boolean
}

export default function CenterDetailsForm({ canEdit }: CenterDetailsFormProps) {
  const form = useFormContext<z.infer<typeof updateCenterSchema>>()
  const organizationQuery = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => getAllOrganization(),
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
                <Input
                  {...field}
                  placeholder='e.g. 香港中心'
                  disabled={!canEdit}
                />
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
                <Input
                  {...field}
                  placeholder='e.g. Hong Kong Center'
                  disabled={!canEdit}
                />
              </FormControl>
              <FormMessage className='col-span-5 col-start-3' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <FormLabel className='col-span-2'>Address (Chinese)</FormLabel>
              <FormControl className='col-span-5'>
                <Textarea
                  {...field}
                  placeholder='e.g. 旺角道'
                  disabled={!canEdit}
                />
              </FormControl>
              <FormMessage className='col-span-5 col-start-3' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='addressEn'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <FormLabel className='col-span-2'>Address (English)</FormLabel>

              <FormControl className='col-span-5'>
                <Textarea
                  {...field}
                  placeholder='e.g. Mong Kok Street'
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
          render={({ field, fieldState }) => (
            <FormControl>
              <FormItem>
                <Label className={fieldState.error && 'text-destructive'}>
                  Organization
                </Label>
                <Select
                  disabled={!canEdit}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select Organization' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {organizationQuery.data?.map((organization) => (
                        <SelectItem
                          value={organization.id}
                          key={organization.id}
                        >
                          {organization.name}
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
