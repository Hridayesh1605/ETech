'use client'

import React from 'react'
import {motion} from "framer-motion"
import Link from "next/link"
import Image from 'next/image'
import { useCarousel } from '@/hooks/useCarousek'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetCoursesQuery } from '@/state/api'
import CourseCardSearch from '@/components/CourseCardSearch'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Typewriter from '@/components/Typewriter'

const LoadingSkeleton=()=>{
    return(
        <div className="landing-skeleton">
            <div className="landing-skeleton__hero">
            <Skeleton className='landing-skeleton__hero-image'/>
                <div className="landing-skeleton__hero-content">

                    <Skeleton className='landing-skeleton__title'/>
                    <Skeleton className='landing-skeleton__subtitle'/>
                    <Skeleton className='landing-skeleton__subtitle-secondary'/>
                    <Skeleton className='landing-skeleton__button'/>
                </div>
                
            </div>
            <div className="landing-skeleton__featured">
            <Skeleton className='landing-skeleton__featured-title'/>
            <Skeleton className='landing-skeleton__featured-description'/>
            <div className="landing-skeleton__tags">
                {[1,2,3,4,5].map((_,index)=>(
                    <Skeleton key={index} className='landing-skeleton__tag'/>
                    
                ))}
            </div>
            <div className="landing-skeleton__courses">
                {[1,2,3,4].map((_,index)=>(
                    <Skeleton key={index} className='landing-skeleton__course-card'/>
                    
                ))}
            </div>
            </div>
        </div>
    );
};

const Landing = () => {
    // const {user} = useUser()
    // // console.log(user)
    const router = useRouter()
    const currentImage = useCarousel({totalImages:3});
    const {data:courses,isLoading,isError}=useGetCoursesQuery({})

    const handleCourseClick = (courseId:string)=>{
        router.push(`/search?id=${courseId}`,{
            scroll:false,
        })
    }
    

    if(isLoading) return <LoadingSkeleton/>;


  return (
    <motion.div 
    initial={{opacity:0}}
    animate={{opacity:1}}
    transition={{duration:0.5}}
    className='landing'
    >
        <motion.div 
    initial={{y:20,opacity:0}}
    animate={{y:0,opacity:1}}
    transition={{duration:0.5,delay:0.5}}
    className='landing__hero'
    >
        
        <motion.div
        initial={{scale:0.5,opacity:0}}
        animate={{scale:1,opacity:1}}
        transition={{duration:0.5,delay:0.5}}
         className="landing__hero-images">
            {/* {["/pic1.jpg","/pic2.jpg","/pic3.jpg","/hero3.jpg"].map((src,index)=>(
                <Image
                key={index}
                src={src}
                alt={`Hero Banner ${index + 1}`}
                fill
                priority={index === currentImage}
                sizes='(max-width:768px) 100vw,(max-width:1200px) 50vw,33vw'
                className={`landing__hero-image ${
                    index === currentImage ? 'landing__hero-image--active':"" 
                }`}
                />
            ))
                
            } */}
            <Image
      src="/hero.gif" // Path relative to the public folder
      alt="My SVG image"
      width={500} // Set the desired width
      height={500} // Set the desired height
    />
        </motion.div>
        <motion.div
        initial={{y:20,opacity:0}}
        animate={{y:0,opacity:1}}
        transition={{duration:0.5,delay:0.7}}

         className="landing__hero-content">
            <motion.h1
            initial={{y:-20,opacity:0}}
            animate={{y:0,opacity:1}}
            transition={{duration:0.5,delay:1.2}}
             className="landing__title">
                <Typewriter text='Leearn Anywhere, Grow Everywhere.' typingSpeed={100}/>
                </motion.h1>
                <motion.p 
                initial={{y:20,opacity:0}}
                animate={{y:0,opacity:1}}
                transition={{duration:0.5,delay:1.7}}
                className="landing__discription">
                Empower your journey with our eLearning platform, designed to make education accessible, engaging, and effective. From professional skills to personal growth, we offer a wide range of courses tailored to your needs. Learn at your own pace, connect with experts, and achieve your goals—anytime, anywhere. Join us and unlock the future of learning!
                    {/* <br />
                    Courses when need them and want then */}
                </motion.p>
                <motion.div
                initial={{y:20,opacity:0}}
                animate={{y:0,opacity:1}}
                transition={{duration:0.5,delay:2.1}}
                 className="landing__cta">
                    <Link href="/search" scroll={false}>
                    <div className="landing__cta-button">Search for cources</div>
                    </Link>
                </motion.div>
            
        </motion.div>
        
    </motion.div>
    <motion.div 
    initial={{y:20,opacity:0}}
    whileInView={{y:0,opacity:1}}
    transition={{duration:0.5}}
    viewport={{amount:0.3,once:true}}//amount= when it is going to execute and animation should only hapn sonce
    className='landing__featured'
    >
        <h2 className="landing__featured-title">Active Courses</h2>
        <p className="landing__featured-description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita atque autem consectetur possimus necessitatibus numquam natus aut doloremque omnis eum?
        </p>
        {/* <div className="landing__tags">
            {["web developement",
                "enterprise IT",
                "react nextjs",
                "javascript",
                "backend dev"
            ].map((tag,index)=>(
                <span className="landing__tag" key={index}>{tag}</span>
            ))}
        </div> */}

        <div className="landing__courses">
            {courses && 
            courses.slice(0,4).map((course,index)=>(
                <motion.div 
                key={course.courseId}
                initial={{y:50,opacity:0}}
                whileInView={{y:0,opacity:1}}
                transition={{duration:0.5,delay:index*0.2}}
                viewport={{amount:0.4}}
                className=''>
                    <CourseCardSearch
                    course={course}
                    onClick={()=>handleCourseClick(course.courseId)}
                    />

                </motion.div>
            ))}



        </div>

    </motion.div>
    </motion.div>
  )
}

export default Landing