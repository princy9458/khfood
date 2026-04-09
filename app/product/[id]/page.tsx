import Component from "@/components/pages/ProductDetailPage";
import GetSingleProduct from "@/lib/GetAllDetails/GetSingleProduct";
import { getSingleForm, getSingleProduct } from "@/lib/getPageData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getSingleProduct(id);
  let form = null;
  if (product.formId) {
    form = await getSingleForm(product.formId);
  }

  return (
    <>
      {/* <GetSingleProduct id={params.id} /> */}
      <Component currentProduct={product} form={form} />
    </>
  );
}
