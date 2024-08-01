import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/system';

const rainbowColors: string[] = [
    'hsl(1deg, 100%, 55%)', // red
    'hsl(25deg, 100%, 50%)', // orange
    'hsl(40deg, 100%, 50%)', // yellow
    'hsl(130deg, 100%, 40%)', // green
    'hsl(230deg, 100%, 45%)', // blue
    'hsl(240deg, 100%, 45%)', // indigo
    'hsl(260deg, 100%, 55%)', // violet
];

const RainbowButton = styled(Button)`
    background: radial-gradient(
        circle,
        ${rainbowColors.join(', ')}
    );
    background-size: 400% 400%;
    animation: rainbow 10s ease infinite;
    color: white;
    font-weight: bold;
    position: relative;
    overflow: hidden;
    
    @keyframes rainbow {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    &:hover {
        opacity: 0.8;
    }

    &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: inherit;
        border-radius: 50%;
        z-index: -1;
        animation: rotate 10s linear infinite;
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    &.Mui-disabled {
        background: gray;
        animation: none;
        color: lightgray;
        cursor: not-allowed;
        &::before {
            content: none;
        }
    }
`;

interface AnimatedRainbowButtonProps extends ButtonProps {
    children: React.ReactNode;
    onClick: () => void
}

const AnimatedRainbowButton: React.FC<AnimatedRainbowButtonProps> = ({ children, onClick, ...props }) => {
    return (
        <RainbowButton
            className="px-4 py-2 rounded-lg"
            {...props}
            onClick={onClick}
        >
            {children}
        </RainbowButton>
    );
};

export default AnimatedRainbowButton;