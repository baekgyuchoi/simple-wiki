

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import React from 'react';
import validator from "validator"

// make 


interface Props {
    // Define the props for your component here
    citations: string;
}






const ReferenceList: React.FC<Props> = async (props) => {
    // Define your component logic here 
    const citations_list = props.citations.split(",")


    return (
        // Return your JSX here 
        <div>
            <div className='flex items-center justify-center'>
                <h4 className="mb-4 flex bg-gradient-to-br from-primary to-secondary bg-clip-text w-fit pb-1 text-xl font-bold text-transparent">References</h4>
            </div>
            <ScrollArea className="h-96 w-full rounded-md border border-gray-400">
                <div className="p-4 ">
                    {citations_list.map((ref, index) => {
                        if(!validator.isURL(ref)){
                            return null
                        }
                        return(
                        <div key={index} className="">
                            <Link href={ref} className='text-sm'>
                                <p className='break-all'>
                                    {ref}
                                </p>
                            </Link>
                            
                            <Separator className="my-2" />
                        </div>
                        )
                    })}
                </div>
            </ScrollArea>
        </div>
        

    );
};

export default ReferenceList;