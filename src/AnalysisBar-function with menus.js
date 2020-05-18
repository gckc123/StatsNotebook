import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ChangeHistoryIcon from '@material-ui/icons/ChangeHistory';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 0,
        borderBottom: '1px solid #e8e8e8',
    },

    StyledButton: {
        '&:hover': {
            color: '#40a9ff',
            opacity: 1,
         },
        '&:focus': {
            outline: 'none',
         },
         textTransform: 'none',
    },
    StyledIcon: {
        marginRight: '5px',
    },
    StyleMenuItem: {
        textTransform: 'none',  
        fontWeight: theme.typography.fontWeightMedium,
        marginRight: theme.spacing(0),
        fontSize: 'small',
        '&:hover': {
            color: '#40a9ff',
            opacity: 1,
        },
        '&$selected': {
            color: '#1890ff',
            fontWeight: theme.typography.fontWeightMedium,
        },

    }
}));



export function AnalysisBar () {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    }
    
    const handleClose = (event) => {
        setAnchorEl(null);
    }

    return (
        <div className={classes.root}>
            <Button edge="start" className={classes.StyledButton} disableRipple onClick={handleMenu}>
                <ChangeHistoryIcon className={classes.StyledIcon}/> Mediation
            </Button>
            <Menu anchorEl={anchorEl} 
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin = {{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
            >
                <MenuItem className={classes.StyleMenuItem} onClick={handleClose} disableRipple>One Mediator</MenuItem>
                <MenuItem className={classes.StyleMenuItem} onClick={handleClose} disableRipple>Two Mediators</MenuItem>
                <MenuItem className={classes.StyleMenuItem} onClick={handleClose} disableRipple>Three Mediators</MenuItem>
            </Menu>
        </div>
    )
}