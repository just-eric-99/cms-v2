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
import { useQuery } from '@tanstack/react-query'
import { getAllCenters } from '@/network/centers/api.ts'

type UserGroupsCreateFormProps = {
  preDefinedCenterId?: string
}
export default function UserGroupsCreateForm(props: UserGroupsCreateFormProps) {
  const form = useFormContext()
  const centerQuery = useQuery({
    queryKey: ['centers'],
    queryFn: getAllCenters,
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
      </div>
    </Form>
  )
}
