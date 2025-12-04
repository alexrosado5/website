// src/app/staff/page.tsx
import { Flex, Meta, Schema } from "@once-ui-system/core";
import { baseURL, person } from "@/resources";
import StaffPortal from "@/components/portal/StaffPortal";

// Similar a otras páginas, generamos metadatos
export async function generateMetadata() {
  return Meta.generate({
    title: "Portal administrativo",
    description: "Acceso para empleados",
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent("Portal administrativo")}`,
    path: "/staff",
  });
}

export default function StaffPage() {
  return (
    <Flex maxWidth="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title="Portal administrativo"
        description="Acceso para empleados"
        path="/staff"
        image={`/api/og/generate?title=${encodeURIComponent("Portal administrativo")}`}
        author={{
          name: person.name,
          url: `${baseURL}/staff`,
          image: `${baseURL}/${person.avatar}`,
        }}
      />
      <StaffPortal />
    </Flex>
  );
}
