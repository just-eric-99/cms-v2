import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getAllOrganization } from '@/network/organization/api'
import { useQuery } from '@tanstack/react-query'
import { Controller, useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label.tsx'
import { useEffect } from 'react'

type CenterCreateFormProps = {
  preDefinedOrganizationId?: string
}
export default function CenterCreateForm(props: CenterCreateFormProps) {
  const form = useFormContext()
  const organizationQuery = useQuery({
    queryKey: ['organizations'],
    queryFn: getAllOrganization,
  })

  useEffect(() => {
    if (props.preDefinedOrganizationId)
      form.setValue('organizationId', props.preDefinedOrganizationId)
  }, [props.preDefinedOrganizationId])

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
                <Input {...field} placeholder='e.g. 香港中心' />
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
                <Input {...field} placeholder='e.g. Hong Kong Center' />
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
                <Textarea {...field} placeholder='e.g. 旺角道' />
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
                <Textarea {...field} placeholder='e.g. Mong Kok Street' />
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
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={props.preDefinedOrganizationId !== undefined}
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
