

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
    // Define the props for your component here
}



const HomeButton: React.FC<Props> = ({ /* Destructure your props here */ }) => {
    // Define your component logic here
    
    return (
        // Return your JSX here
        <Link 
        href="/"
        className="">
        <div className='flex items-center justify-center  '>
            <div className=" flex items-center justify-center mt-2  " >
                <img
                    src='/Maga_wiki_long_logo.png'
                    alt='Maga Wiki Logo'
                    className='w-1/2'
                    
                    ></img>
               
            </div>
        </div>
        </Link>
    );
};

export default HomeButton;
