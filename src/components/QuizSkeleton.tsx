import { Skeleton } from '@/components/ui/skeleton';
import { LessonHeaderSkeleton } from './LessonHeaderSkeleton';

export function QuizSkeleton() {
  return (
    <div className="skeleton-flow" aria-hidden="true" style={{ width: '100%' }}>
      <LessonHeaderSkeleton />

      <section style={{ marginTop: 24, width: '100%' }}>
        <fieldset>
          <legend style={{ padding: 0, margin: '0 0 10px 0' }}>
            <Skeleton className="h-5 w-32 rounded-md" />
          </legend>
          <div className="radio-row">
            <Skeleton className="h-[42px] sm:h-[48px] w-36 rounded-xl sm:rounded-2xl" />
            <Skeleton className="h-[42px] sm:h-[48px] w-40 rounded-xl sm:rounded-2xl" />
            <Skeleton className="h-[42px] sm:h-[48px] w-32 rounded-xl sm:rounded-2xl" />
          </div>
        </fieldset>

        <fieldset style={{ marginTop: 20 }}>
          <legend style={{ padding: 0, margin: '0 0 10px 0' }}>
            <Skeleton className="h-5 w-28 rounded-md" />
          </legend>
          <div className="radio-row">
            <Skeleton className="h-[42px] sm:h-[48px] w-28 rounded-xl sm:rounded-2xl" />
            <Skeleton className="h-[42px] sm:h-[48px] w-36 rounded-xl sm:rounded-2xl" />
            <Skeleton className="h-[42px] sm:h-[48px] w-36 rounded-xl sm:rounded-2xl" />
          </div>
        </fieldset>

        <div style={{ margin: '16px 0 24px' }}>
          <Skeleton className="h-4.5 w-72 max-w-[85%] rounded-md" />
        </div>

        <div className="actions" style={{ width: '100%' }}>
          <Skeleton className="h-[46px] sm:h-[52px] w-full rounded-2xl" />
        </div>
      </section>
    </div>
  );
}
