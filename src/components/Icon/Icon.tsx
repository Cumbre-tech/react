import React from 'react';

import { colors } from '../../config';
import DynamicIcon from '../DynamicIcon/DynamicIcon';
import { icons } from '../../data/icons';

const resolveColor = (color: string | undefined, colorKey: string | undefined, extraData: any) => {
    if (colorKey && extraData && extraData[colorKey]) {
        return extraData[colorKey];
    } else if (color && (color in colors)) {
        return colors[color as keyof typeof colors]; // We make sure that 'color' is a valid colors key
    } else if (color) {
        return color;
    } else {
        return colors.text; // Default color
    }
};

const resolveName = (name: any, extraData: any) => {
    if (name.includes('{{') && name.includes('}}')) {
        const propertyName = name.match(/\{\{(.+?)\}\}/)[1];
        return extraData[propertyName];
    }
    return name;
};

const resolvePaths = (paths: any, pathsKey: string | undefined, extraData: any) => {
    if (pathsKey && extraData && extraData[pathsKey]) {
        return extraData[pathsKey];
    }
    return paths;
};

interface IconPath {
    d: string;
    color?: keyof typeof colors | string;
}

interface IconProps {
    name?: string;
    paths?: IconPath[];
    pathsKey?: string;
    size?: number;
    style?: React.CSSProperties;
    color?: string;
    colorKey?: string;
    extraData?: any;
}

const Icon: React.FC<IconProps> = ({
    name,
    paths,
    pathsKey,
    size = 24,
    style = {},
    color,
    colorKey,
    extraData = {},

}) => {
    const resolvedColor = resolveColor(color, colorKey, extraData);
    const resolvedName = resolveName(name, extraData);
    const iconPaths = paths || (resolvedName && icons.find((icon: { name: string }) => icon.name === resolvedName)?.paths);

    if (!iconPaths) {
        console.warn(`Icon with name "${name}" not found`);
        return null;
    }

    const preparedPaths = iconPaths.map((path: IconPath) => ({
        ...path,
        color: resolvedColor || path.color || colors.text,
    }));


    const resolvedPaths = resolvePaths(preparedPaths, pathsKey, extraData);
    return (
        <DynamicIcon
            size={size}
            paths={resolvedPaths}
            style={style}
        />
    );
};

export default Icon;
