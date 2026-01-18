import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, schema }) => {
    return (
        <Helmet>
            <title>{title} | Kisan Bazaar</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={`${title} | Kisan Bazaar`} />
            <meta property="og:description" content={description} />
            <meta name="twitter:title" content={`${title} | Kisan Bazaar`} />
            <meta name="twitter:description" content={description} />
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
