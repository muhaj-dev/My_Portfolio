import sanityClient from '@sanity/client';
import imageUrlBulider from '@sanity/image-url';

export const client = sanityClient ({
    projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2022-10-20',
    useCdn: true,
    token: process.env.REACT_APP_SANITY_TOKKEN,
});

const builder = imageUrlBulider(client);

export const urlFor = (source) => builder.image(source);