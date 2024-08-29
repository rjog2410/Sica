// Archivo: BodyHeader.tsx
import React, { useState } from 'react';
import { Box, Typography, IconButton, TypographyProps, Popover, TooltipProps } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info'; 

interface OutletHeaderProps {
    typographyPropsRoute?: TypographyProps;
    typographyPropsTitle?: TypographyProps; 
    tooltipProps?: Omit<TooltipProps, 'children'> & { title: NonNullable<TooltipProps['title']> };
    headerRoute: string;
    TitlePage: string;
}

const BodyHeader: React.FC<OutletHeaderProps> = ({ typographyPropsRoute, typographyPropsTitle, tooltipProps, headerRoute, TitlePage }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <Box width="100%">
            {/* Fila superior con headerRoute y el tooltip */}
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                <Typography {...typographyPropsRoute}>
                    {headerRoute}
                </Typography>
                <Box display="flex" alignItems="center">
                    <IconButton onClick={handleClick}>
                        <InfoIcon />
                    </IconButton>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <Box p={2}>
                            <Typography>{tooltipProps?.title}</Typography>
                        </Box>
                    </Popover>
                </Box>
            </Box>
            {/* Título de la página, abajo de la fila superior */}
            <Typography {...typographyPropsTitle} sx={{ marginTop: 2 }}>
                {TitlePage}
            </Typography>
        </Box>
    );
};

export default BodyHeader;
