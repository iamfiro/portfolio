export type AvailableTechStack = 'react' | 'nextjs'

export const humanizeTechStackName = (techStack: AvailableTechStack) => {
    switch (techStack) {
        case 'react':
            return 'React';
        case 'nextjs':
            return 'Next.js';
        default:
            throw new Error('Not implemented');
    }
}