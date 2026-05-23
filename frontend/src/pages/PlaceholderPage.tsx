import { AppHeader } from "@/components/layout/AppHeader";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <PageShell header={<AppHeader title={title} />}>
      <div className="p-6">
        <Card className="max-w-2xl border-stone-200/80">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-left text-sm text-stone-600">{description}</p>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
