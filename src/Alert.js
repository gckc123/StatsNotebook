import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';

const StyledButton = withStyles({
    root: {
        '&:hover': {
            color: '#40a9ff',
            opacity: 1,
        },
        '&:focus': {
            outline: 'none',
        },
        color: '#40a9ff',
    },
    label: {
        textTransform: 'none',
        fontSize: '15px'
    }   
})(Button);

export class Alert extends Component {
    
    render () {
        return (
            <Dialog
                open={this.props.showAlert}
                onClose={this.props.closeAlertCallback}>
                <DialogTitle>{this.props.title}</DialogTitle>
                <DialogContent><DialogContentText>{this.props.content}
                </DialogContentText></DialogContent>
                <DialogActions>
                    <StyledButton onClick={this.props.closeAlertCallback}>
                        OK
                    </StyledButton>
                </DialogActions>
            </Dialog>
        )
    }
}
