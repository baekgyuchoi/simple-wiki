import { Card } from '@/components/ui/card';
import { PageSummary } from '@/lib/validators/page_summary';
import Link from 'next/link';
import Image from 'next/image';

import React from 'react';

// make 


interface Props {
    // Define the props for your component here
    page_title: string;
    page_id: number;
    snippet: string;
}







const PreviewSearchItemButton: React.FC<Props> = (props) => {
    // Define your component logic here 

    const page_title = props.page_title;
    const page_id = props.page_id;
    
    const page_title_slug = page_title.replace(/ /g, "-").toLowerCase();
 
    
    return (
        // Return your JSX here 
    
            <Link href={"/pages/" + page_title_slug + "?page=" + page_id} className='flex items-center justify-center overflow-hidden mb-1'>
                <Card className='border-2 border-black w-full bg-white'>              
                    <div className="flex flex-row w-full p-2 pl-4 pr-4">
                        <div className="group flex items-center gap-x-4 py-1">
                           
                            <div className="min-w-0 max-w-md flex items-start flex-col mr-4">
                                <p className="w-48 text-sm text-black truncate">{page_title}</p>
                                <p className="pr-3 text-gray-700 text-xs max-w-64 truncate">{props.snippet}</p>
                            </div>
                        </div>
                        
                    </div>
                </Card>
            </Link>

    );
};

export default PreviewSearchItemButton;