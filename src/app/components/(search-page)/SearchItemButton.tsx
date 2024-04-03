
import { Card } from '@/components/ui/card';
import { PageSummary } from '@/lib/validators/page_summary';


import Link from 'next/link';

import React from 'react';

// make 


interface Props {
    // Define the props for your component here
    page_title: string;
    page_id: number;
    page_description: string;
}






const SearchItemButton: React.FC<Props> = async (props) => {
    // Define your component logic here 

    const page_title = props.page_title;
    const page_id = props.page_id;
    const page_description = props.page_description
    
    const page_title_slug = page_title.replace(/ /g, "-").toLowerCase();
    
    return (
        // Return your JSX here 
    
        <Link href={"/pages/" + page_title_slug + "?page=" + page_id} className='w-full overflow-hidden'>
            <Card className='border-2 border-black '>              
                <div className="flex flex-row w-fit bg-gradient-to-br from-gray-500 to-black bg-clip-text w-fit text-transparent p-2 pl-4 pr-4">
                    {page_title}
                </div>
                <div className='flex flex-row w-full  p-2 pl-4 pr-4 text-base text-gray-800'>
                    {page_description}
                </div>
            </Card>
        </Link>

    );
};

export default SearchItemButton;