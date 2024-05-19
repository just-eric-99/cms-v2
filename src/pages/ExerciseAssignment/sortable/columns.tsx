import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableExerciseCard from '@/pages/ExerciseAssignment/sortable/exercise.tsx'
import { ExerciseAssignment } from '@/network/exercise-assignment/types.ts'

type SortableColumnProps = {
  data: ExerciseAssignment[]
}

export default function SortableColumn(props: SortableColumnProps) {
  return (
    <div className={"flex flex-col gap-5"}>
      <SortableContext
        items={props.data}
        strategy={verticalListSortingStrategy}
      >
        {props.data.map((item) => (
          <SortableExerciseCard
            key={item.id}
            sortableExerciseAssignment={item}
          />
        ))}
      </SortableContext>
    </div>
  )
}
