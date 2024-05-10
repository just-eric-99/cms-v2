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
import { useFormContext } from 'react-hook-form'

export default function UserCreateForm() {
  const form = useFormContext()

  return (
    <Form {...form}>
      <div className='flex flex-1 flex-col justify-start gap-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <div className='grid grid-cols-7 items-center gap-4 text-end'>
                <FormLabel className='col-span-2'>Name</FormLabel>
                <FormControl className='col-span-5'>
                  <Input {...field} placeholder='name' />
                </FormControl>
              </div>
              <div className='grid grid-cols-7 gap-4'>
                <FormMessage className='col-span-5 col-start-3' />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='displayName'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <div className='grid grid-cols-7 items-center gap-4 text-end'>
                <FormLabel className='col-span-2'>Display Name</FormLabel>
                <FormControl className='col-span-5'>
                  <Input {...field} placeholder='display name' />
                </FormControl>
              </div>
              <div className='grid grid-cols-7 gap-4'>
                <FormMessage className='col-span-5 col-start-3' />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <div className='grid grid-cols-7 items-center gap-4 text-end'>
                <FormLabel className='col-span-2'>Email</FormLabel>
                <FormControl className='col-span-5'>
                  <Input {...field} placeholder='email' />
                </FormControl>
              </div>
              <div className='grid grid-cols-7 gap-4'>
                <FormMessage className='col-span-5 col-start-3' />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <div className='grid grid-cols-7 items-center gap-4 text-end'>
                <FormLabel className='col-span-2'>Phone</FormLabel>
                <FormControl className='col-span-5'>
                  <Input {...field} required placeholder='phone' />
                </FormControl>
              </div>
              <div className='grid grid-cols-7 gap-4'>
                <FormMessage className='col-span-5 col-start-3' />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='avatar'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <div className='grid grid-cols-7 items-center gap-4 text-end'>
                <FormLabel className='col-span-2'>Avatar</FormLabel>
                <div className='col-span-5'>
                  <FormControl className='col-span-5'>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select Avatar' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value={'0'}>Male</SelectItem>
                          <SelectItem value={'1'}>Female</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className='grid grid-cols-7 gap-4'>
                <FormMessage className='col-span-5 col-start-3' />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='centerId'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <div className='grid grid-cols-7 items-center gap-4 text-end'>
                <FormLabel className='col-span-2'>Center</FormLabel>
                <div className='col-span-5'>
                  <FormControl>
                    <Select onValueChange={(value) => field.onChange(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select Center' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem
                            value={'77406df7-51c1-4ec3-b58f-e065222ae1e0'}
                          >
                            Center 1
                          </SelectItem>
                          <SelectItem
                            value={'a0d406ad-0d7c-42fd-9061-49ad02efe131'}
                          >
                            Center 2
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className='grid grid-cols-7 gap-4'>
                <FormMessage className='col-span-5 col-start-3' />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='userGroupId'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <div className='grid grid-cols-7 items-center gap-4 text-end'>
                <FormLabel className='col-span-2'>User Group</FormLabel>
                <div className='col-span-5'>
                  <FormControl>
                    <Select onValueChange={(value) => field.onChange(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a user group' />
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
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className='grid grid-cols-7 gap-4'>
                <FormMessage className='col-span-5 col-start-3' />
              </div>
            </FormItem>
          )}
        />
      </div>
    </Form>
  )
}
