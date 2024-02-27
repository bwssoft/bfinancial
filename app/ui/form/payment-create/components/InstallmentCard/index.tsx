// import { OmieOfferInstallment } from "@/app/lib/definitions/OmieOffer";
// import React from "react";
// import { useInstallmentCard } from "./useInstallmentCard";
// import { cn } from "@/app/utils/cn";

// export type IInstallmentCardType = OmieOfferInstallment & {
//     className?: string;
// };

// const InstallmentCard: React.FC<IInstallmentCardType> = ({
//     className,
//     ...props
// }) => {
//     const { onHandleClick } = useInstallmentCard();

//     return (
//         <div
//             onClick={() => onHandleClick(props)}
//             className={cn(
//                 "flex flex-col gap-2 cursor-pointer hover:scale-[102%] transition-all bg-white rounded-md px-4 py-5 sm:p-6",
//                 className
//             )}
//         >
//             <div className="text-sm font-medium">
//                 Parcela Nº
//                 <span className="text-indigo-600 ml-1 font-semibold">
//                     {props.numero_parcela}
//                 </span>
//             </div>
//             <div className="flex w-fit items-baseline text-2xl font-semibold rounded-lg text-green-800">
//                 {props.valor.toLocaleString("pt-br", {
//                     style: "currency",
//                     currency: "BRL",
//                 })}
//             </div>
//             <div className="flex flex-col gap-1 text-sm text-red-600 font-medium justify-center items-end">
//                 <div
//                     className={
//                         "inline-flex items-baseline bg-green-100 text-green-800 rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0"
//                     }
//                 >
//                     {props.percentual}%
//                 </div>
//                 Vencimento: {props.data_vencimento}
//             </div>
//         </div>
//     );
// };

// export default InstallmentCard;
