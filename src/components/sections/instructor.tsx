import React from 'react'
import Section from '../Layout/Section'
import Container from '../Layout/Container'
import Row from '../Layout/Row'
import ContentWrapper from '../Layout/ContentWrapper'
import Image from 'next/image'
import ImageWrapper from '../Layout/ImageWrapper'
import Icon from '../resources/Icon'
import useWindowSize from '@/hooks/useWindowSize'

// import style from "@/styles/instructor.module.scss";

const Instructor = () => {
    const { width } = useWindowSize();

    const iconSize = {
        width: "20px"
    }

    const instructors = [
        {
            url: 'instructors/ChetnaSingla(@mandalasbychetna).jpg',
            name: 'Chetna Singla',
            handle: '@mandalasbychetna',
            instagram: 'https://www.instagram.com/mandalaconfluencesbychetna/',
            description: "Chetna is an artist based in Delhi, India with over 5 years of experience in the art world. She is passionate about teaching mandalas and doodles, and she creates captivating art content for platforms like Instagram, Pinterest, and occasionally YouTube. Known for her love of chai, sweets, and stylish accessories, Chetna can usually be found immersed in the creative process, organizing her space, enjoying the soulful tunes of Coke Studio, or capturing breathtaking pictures of the sky. In the upcoming Mandala Confluence, Chetna will be hosting an engaging workshop on doodling. Participants will discover the art of creating mesmerizing doodles using simple shapes, patterns, and vibrant colors. Whether you're a beginner seeking to explore your artistic side or a seasoned professional, Chetna's workshop promises an enjoyable experience filled with new insights and techniques. Make sure to join her session and unlock your creative potential."
        },
        {
            url: 'instructors/LeepiDedhia(@handmadebyleepidedhia).jpeg',
            name: 'Leepi Dedhia',
            handle: '@handmadebyleepidedhia',
            instagram: 'https://www.instagram.com/handmadebyleepidedhia',
            description: "Leepi is an artist known for her expertise in multiple art forms. Her primary focus is on String Art, but she also explores other mediums such as Resin Art, Scrapbooking, and Digital Art, among others. She operates her own small business called 'Handmade by Leepi Dedhia,' which recently celebrated its sixth anniversary. Based in Mumbai, she is dedicated to spreading love and joy through her art, while constantly pushing the boundaries and challenging the limitations we often associate with it. Leepi's artistic vision extends beyond traditional art forms, as she strives to bridge the gap between art and utility by creating functional art pieces. She believes, “There’s so much beauty in everyday things. There is art, and a scope for art, everywhere.” With a deep appreciation for the inherent artistic possibilities surrounding us, Leepi aims to inspire others and encourage them to recognize the artistic potential in their surroundings."
        },
        {
            url: 'instructors/Vinita(@that.crazy.doodler).jpg',
            name: 'Vinita',
            handle: '@that.crazy.doodler',
            instagram: 'https://www.instagram.com/that.crazy.doodler',
            description: "Vinita is a versatile artist known for her expertise in painting still life and creating captivating mixed media doodles. Her unique artistic style has evolved over the years through the seamless blending of different mediums, infused with the mindful essence of doodles and mandalas. She also serves as the Brand Educator for Daniel Smith Art materials and Etchr Lab. Her collaboration extends to renowned brands like Google, Amazon, HP, and more, where she has contributed her artistic talents to their captivating social media campaigns. As a dedicated art educator, Vinita has made a significant impact on various learning platforms, including Skillshare. She has conducted numerous mandala and watercolor workshops across the globe, sharing her passion and expertise with aspiring artists and enthusiasts alike."
        },
        {
            url: 'instructors/FernandaBonafini(@ataraxiaowl).png',
            name: 'Fernanda',
            handle: '@ataraxiaowl',
            instagram: 'https://www.instagram.com/ataraxiaowl',
            description: "Fernanda is known for her unique mandala designs that bring a sense of tranquility to any ambiance. Operating under the artistic name Ataraxiaowl, she specializes in digital mandala art, creating captivating pieces that embody her artistic vision. Ataraxia, representing a state of serene tranquility, perfectly complements the owl, symbolizing wisdom and the ability to navigate through life's challenges. Through her art, Ataraxiaowl seeks to empower individuals on their journey of self-discovery and realization of their dreams. Using her creativity and the Procreate App on her iPad Pro with Apple Pencil, she meticulously crafts each artwork, ensuring it reflects the emotions and aspirations of those who strive for personal growth."
        },
        {
            url: 'instructors/VaishnaviLuniya(@mandalabyvaishnavi).jpg',
            name: 'Vaishnavi Luniya',
            handle: '@mandalabyvaishnavi',
            instagram: 'https://www.instagram.com/mandalaconfluencebyvaishnavi',
            description: "Vaishnavi is an artist with a deep-rooted passion for creativity that has been a part of her life for as long as she can remember. Her love for drawing, painting, and crafting has always been present, but it wasn't until recently that she made the conscious decision to prioritize and embrace this artistic side of herself. During her formative years, Vaishnavi encountered discouragement from those around her who believed that pursuing a career in art wouldn't lead to financial stability. As a young teenager, she heeded their advice and ventured into the design industry, leaving her dreams of becoming an artist behind as a distant memory. However, a void began to grow within Vaishnavi, and she soon realized that art was missing from her life. In 2020, a sudden urge ignited within her, compelling her to unpack her old art supplies and reignite her creative journey. From that point forward, she never looked back. While Vaishnavi enjoys experimenting with various artistic mediums, her true expertise lies in the realm of mandala art. She finds immense joy in creating dot mandalas, exploring diverse color combinations and patterns that bring her compositions to life. For Vaishnavi, art is not just a form of expression but also a form of meditation, providing her with a sense of serenity and tranquility. Driven by her passion, Vaishnavi is dedicated to sharing her knowledge of art through art sessions and workshops. She understands the transformative power of art and aims to spread happiness and inspiration to others through her creative endeavors. Since sharing her artwork on Instagram, Vaishnavi has garnered appreciation from people who resonate with her unique artistic style. With a genuine desire to connect with others and promote the joy of art, she hopes to inspire others to find their own happiness and fulfillment through creative expression."
        },
        {
            url: 'instructors/DivdrishtSuri(@mandalas_by_divdrisht).jpeg',
            name: 'Divdrisht Suri',
            handle: '@mandalas_by_divdrisht',
            instagram: 'https://www.instagram.com/mandalaconfluences_by_divdrisht',
            description: "Divdrisht is a Mandala and Mural artist from Calcutta. Over the past five years, she has conducted an impressive number of mandala workshops, surpassing 1200 sessions in 14 countries. Her remarkable achievements have been recognized and featured in renowned publications such as The Hindu, Telegraph, Indian Voices, The Mumbai Mirror, and five online journals. Notably, Divdrisht has made significant contributions as a member of the Mandala Art Team with Brustro Official India. Her passion for promoting art as a form of wellness and therapy has led her to organize workshops and create captivating mandala videos for esteemed brands including Google, Amazon, Byju's, Myntra, HSBC India, and several other prominent corporations."
        },
        {
            url: 'instructors/PrafulJain(@praful_creations).jpg',
            name: 'Praful Jain',
            handle: '@praful_creations',
            instagram: 'https://www.instagram.com/praful_creations',
            description: "Praful is an artist based out of Ashta, Madhya Pradesh. From a young age, he had a deep love for painting, and during the lockdown, he wholeheartedly pursued his passion, utilizing social media as a platform to share his artistic endeavors. Praful's artistic expression knows no bounds as he explores various mediums in his paintings. His subjects range from capturing the beauty of people and animals to the intricate details of landscapes. In addition to his artwork, Praful has developed a strong interest in showcasing his creative process through engaging reels on social media. Through these captivating videos, he invites viewers into his world of art, sharing his techniques, inspirations, and the stories behind his masterpieces. He is also an Art Educator and conducts online workshops where he imparts the skills of creating compelling reels and seamless transitions to fellow creative enthusiasts. Through these workshops, he empowers others to explore their creativity and unleash their potential in today’s digital world. Praful's passion for art, combined with his dedication to teaching and inspiring others, has garnered him a growing community of admirers. As he continues to pursue his artistic journey, he remains committed to spreading the joy and beauty of art, nurturing creativity in others, and making a lasting impact in the art world."
        },
        {
            url: 'instructors/NikhatSheikh(@nikhatillustrations).jpg',
            name: 'Nikhat Sheikh',
            handle: '@nikhatillustrations',
            instagram: 'https://www.instagram.com/nikhatillustrations',
            description: "Nikhat is a Surface Pattern Designer from Bhilai, Chhattisgarh where she embarked on a unique and inspiring journey towards a creative career. Despite holding a degree in Management, Nikhat's passion led her to pursue a path as a Surface Pattern Designer in 2017. Since then, her dedication to this field has only grown stronger. Nikhat finds profound fulfilment in her creative work, particularly in the process of designing patterns and bringing them to life. The entire journey, from envisioning patterns to the joy of selling tangible products, brings Nikhat immense happiness and satisfaction. Her love for exploration and freedom has been fulfilled through her career, especially when she gets the chance to travel amidst breathtaking mountains. Today, Nikhat proudly serves as a teacher and mentor, sharing her expertise and guiding aspiring individuals who wish to succeed in the world of surface pattern design. With a blend of skill and passion, she inspires others to pursue their creative dreams and carve out a rewarding path in this field."
        },
        {
            url: 'instructors/ParidhiJhanwar(@pari.doodles).jpg',
            name: 'Paridhi Jhanwar',
            handle: '@pari.doodles',
            instagram: 'https://www.instagram.com/pari.doodles',
            description: "Paridhi is a passionate mandala artist based in Bangalore, India. She has a strong background in fashion design and over two years of industry experience. However, her artistic journey took a captivating turn when she discovered the mesmerizing world of mandalas. For nearly five years, Paridhi has devoted her creative energy to mastering this intricate art form. In 2020, Paridhi made the courageous decision to pursue mandala art as a full-time endeavor, and since then, she has been captivating audiences with her ornate mandala creations. Her intricate designs can be found adorning various surfaces, including paper, canvas, ceramic, wood, and MDF. With a focus on richness of details, her mandalas exude complexity and a true artistic flair. At the upcoming Mandala Confluence, Paridhi will be sharing her expertise and teaching the art of creating ornate mandalas on canvas. Participants will have the opportunity to delve into the intricacies of this enchanting art form under her guidance. Join Paridhi as she explores the depths of mandala art and unveils the secrets behind crafting ornate masterpieces."
        },
        {
            url: 'instructors/SaudaminiMadra(@saudamini.madra).jpg',
            name: 'Saudamini Madra',
            handle: '@saudamini.madra',
            instagram: 'https://www.instagram.com/saudamini.madra',
            description: "Saudamini is an artist specializing in the creation of hand-drawn mandala artwork. She is originally from India and now resides in Durham, North Carolina. Her inspiration draws from various art forms rooted in Buddhist, Hindu, and Mughal traditions, reflecting the rich cultural heritage of India. Her mandalas are meticulously crafted with intricate details, exuding an aura of joy, happiness, and good fortune. In addition to her mandala art, Saudamini also showcases her artistic skills through illustrations that capture the beauty and tranquility of landscapes, appealing to travel enthusiasts and nature lovers alike. Her artwork reflects a sense of peace and harmony found in the natural world. Saudamini takes pride in offering a range of original artworks, prints, greeting cards, and other products featuring her exquisite designs. Her goal is to share her creations with the world and help individuals find the perfect piece for themselves or to gift to their loved ones. With a deep passion for her craft, Saudamini ensures that her artwork brings happiness and joy to all who experience it."
        }
    ]

    return (
        <Section id="instructors">
            <Container>
                <h2>
                    Meet Our Instructors
                </h2>
                <Row options={{ flexWrap: 'wrap' }}>
                    {instructors.map(i => {
                        return (
                            <ContentWrapper
                                options={{
                                    justifyContent: "flex-start",
                                    width: width <= 768 ? "100%" : "calc(50% - 40px)",
                                    padding: "20px",
                                    borderRadius: "15px",
                                    background: "rgba(241, 91, 41, 0.13)"
                                }}
                            >
                                <Image
                                    src={`/mandalaconfluence/${i.url}`}
                                    style={{
                                        borderRadius: "100%",
                                        margin: "0 auto 20px",
                                        objectFit: "cover",
                                        transform: `rotate(${i.name == "Divdrisht Suri" ? "90deg" : "0deg"})`
                                    }}
                                    width={180}
                                    height={180}
                                    alt="Instructor"
                                />
                                <h3
                                    style={{
                                        fontSize: "20px",
                                        textAlign: "center",
                                        marginBottom: "10px",
                                        color: "#F15A29"
                                    }}
                                >{i.name}</h3>
                                <h3 style={{ margin: "0 auto 10px" }}>
                                    <a
                                        href={i.instagram}
                                        target='blank'
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            color: "#1C75BC"
                                        }}
                                    >
                                        <div style={iconSize}><Icon icon="instagram" color="#1C75BC" /></div>
                                        {i.handle}
                                    </a>
                                </h3>
                                <p>{i.description}</p>
                            </ContentWrapper>
                        )
                    })}
                </Row>
            </Container>
        </Section>
    )
}

export default Instructor