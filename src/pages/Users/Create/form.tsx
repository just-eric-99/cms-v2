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
import { getAllCenters } from '@/network/centers/api'
import { useQuery } from '@tanstack/react-query'
import { Controller, useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label.tsx'

type UserCreateFormProps = {
  preDefinedCenterId?: string
}
export default function UserCreateForm(props: UserCreateFormProps) {
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
                  value={props.preDefinedCenterId ?? field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select User Group' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        value={'62f84b5e-05d0-47a9-aaae-95c100c94099'}
                      >
                        User Group 1
                      </SelectItem>
                      <SelectItem
                        value={'088a93fa-be3f-44b3-8ec1-cb11d70356d2'}
                      >
                        User Group 2
                      </SelectItem>
                      <SelectItem
                        value={'6e2a01d8-37d1-4d63-afbd-ffc93c4135d0'}
                      >
                        User Group 3
                      </SelectItem>
                      <SelectItem
                        value={'0b827cb1-ec30-44b1-ae9a-ae23ffc31a5f'}
                      >
                        User Group 4
                      </SelectItem>
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
