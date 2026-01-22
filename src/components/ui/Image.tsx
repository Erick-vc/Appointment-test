import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src?: string;
    alt: string;
    type?: 'user' | 'bussines';
}

import bussines from '@assets/icons/bussines.svg';
import fallback from '@assets/icons/user.svg';

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, type = 'user', ...props }) => {
    const [imgSrc, setImgSrc] = useState<string>(src || (type === 'user' ? fallback : bussines));

    const handleError = () => {
        if (imgSrc !== fallback) {
            setImgSrc(fallback);
        }
    };

    return <img src={imgSrc} alt={alt} onError={handleError} {...props} />;
};

export default ImageWithFallback;
