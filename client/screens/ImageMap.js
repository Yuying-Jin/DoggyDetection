// ImageMap.js
// some sampleUrl from: https://www.akc.org/
const dogImages = [
    {
        // breed: 'Welsh Springer Spaniel',
        filename: 'IMG_5260.jpg',
        imageUrl: 'https://cdn-cafdl.nitrocdn.com/fQHdfFSxWCuDmbpNBOTabVcchzVvBqxc/assets/images/optimized/rev-10d6093/blog/wp-content/uploads/2015/11/beagle2-e1523513313893.jpg',
        sampleUrl: 'https://www.akc.org/wp-content/uploads/2017/11/Welsh-Springer-Spaniel-head-portrait-outdoors.jpg',
        description: 'Welsh Springer Spaniel is known for its friendly and gentle nature. They are excellent family dogs and love outdoor activities.',

    },
    {
        // breed: 'Malinois',
        filename: 'IMG_5261.jpg',
        sampleUrl: 'https://www.akc.org/wp-content/uploads/2017/11/Belgian-Malinois-On-White-01.jpg',
        imageUrl: 'https://cdn-cafdl.nitrocdn.com/fQHdfFSxWCuDmbpNBOTabVcchzVvBqxc/assets/images/optimized/rev-10d6093/blog/wp-content/uploads/2015/11/German-Shepherd-1.jpg',
        description: 'Malinois is a highly intelligent and energetic breed, often used as a working dog. They are known for their loyalty and versatility.',
    },
    {
        // breed: 'Great Dane',
        filename: 'IMG_5262.jpg',
        sampleUrl: 'https://www.akc.org/wp-content/uploads/2017/11/Great-Dane-On-White-01.jpg',
        imageUrl: 'https://cdn-cafdl.nitrocdn.com/fQHdfFSxWCuDmbpNBOTabVcchzVvBqxc/assets/images/optimized/rev-10d6093/blog/wp-content/uploads/2015/11/Great-dane-e1523515851646.jpg',
        description: 'Great Dane is a giant breed with a calm and friendly demeanor. Despite their size, they are known as gentle giants and make excellent companions.',
    },
    {
        // breed: 'Boxer',
        filename: 'IMG_5263.jpg',
        sampleUrl: 'https://www.akc.org/wp-content/uploads/2017/11/Boxer-puppy-laying-down.jpg',
        imageUrl: 'https://cdn-cafdl.nitrocdn.com/fQHdfFSxWCuDmbpNBOTabVcchzVvBqxc/assets/images/optimized/rev-10d6093/blog/wp-content/uploads/2015/11/boxer-dog-funny-images-dowload-e1523516778362.jpg',
        description: 'Boxer is a playful and energetic breed known for its boundless enthusiasm. They are loyal, intelligent, and great with families.',
    },
    {
        // breed: 'Dingo',
        filename: 'IMG_5264.jpg',
        sampleUrl: 'https://media.australian.museum/media/dd/images/Some_image.width-1200.ce75f01.jpg',
        imageUrl: 'https://cdn-cafdl.nitrocdn.com/fQHdfFSxWCuDmbpNBOTabVcchzVvBqxc/assets/images/optimized/rev-10d6093/blog/wp-content/uploads/2015/11/Labrador-Image.jpg',
        description: 'Dingo is a wild dog found in Australia. They are known for their agility and survival instincts in the harsh Australian wilderness.',
    },
    {
        // breed: 'Rottweiler',
        filename: 'IMG_5265.jpg',
        sampleUrl: 'https://www.akc.org/wp-content/uploads/2017/11/Rottweiler-On-White-10.jpg',
        imageUrl: 'https://cdn-cafdl.nitrocdn.com/fQHdfFSxWCuDmbpNBOTabVcchzVvBqxc/assets/images/optimized/rev-10d6093/blog/wp-content/uploads/2015/11/Rottweiler.jpg',
        description: 'Rottweiler is a strong and powerful breed with a calm and confident demeanor. They are known for their loyalty and protective instincts.',
    },
    {
        // breed: 'Pug',
        filename: 'IMG_5266.jpg',
        sampleUrl: 'https://www.akc.org/wp-content/uploads/2017/11/Pug-On-White-01.jpg',
        imageUrl: 'https://cdn-cafdl.nitrocdn.com/fQHdfFSxWCuDmbpNBOTabVcchzVvBqxc/assets/images/optimized/rev-10d6093/blog/wp-content/uploads/2015/11/Pug.jpg',
        description: 'Pug is a small and charming breed with a playful and affectionate personality. They are known for their wrinkled face and curled tail.',
    },
    {
        // breed: 'Malamute',
        filename: 'IMG_5267.jpg',
        sampleUrl: 'https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2017/11/09151144/Alaskan-Malamute-standing-in-the-grass1.jpg',
        imageUrl: 'https://www.petsworld.in/blog/wp-content/uploads/2014/10/Northern-Inuit-Dog1.jpg',
        description: 'Malamute is a large and powerful Arctic sled dog. They are known for their strength, endurance, and friendly disposition.',
    },
    {
        // breed: 'Irish Setter',
        filename: 'IMG_5268.jpg',
        sampleUrl: 'https://www.akc.org/wp-content/uploads/2017/11/Irish-Setter-puppy-laying-down.jpg',
        imageUrl: 'https://cdn-cafdl.nitrocdn.com/fQHdfFSxWCuDmbpNBOTabVcchzVvBqxc/assets/images/optimized/rev-10d6093/blog/wp-content/uploads/2015/11/cocker-e1523535866384.jpg',
        description: 'Irish Setter is an elegant and friendly breed with a vibrant red coat. They are known for their playful and outgoing nature.',
    },
    {
        // breed: 'Cocker Spaniel',
        filename: 'IMG_5269.jpg',
        sampleUrl: 'https://www.akc.org/wp-content/uploads/2017/11/Cocker-Spaniel-puppies.jpg',
        imageUrl: 'https://www.cdc.gov/healthypets/images/pets/cute-dog-headshot.jpg?_=42445',
        description: 'Cocker Spaniel is a sweet and affectionate breed with a silky coat. They are known for their friendly disposition and love for human companionship.',
    },
];


export const getImageUrlByBreed = (filename) => {
    return dogImages?.find((dog) => dog.filename?.toLowerCase() === filename?.toLowerCase());
};