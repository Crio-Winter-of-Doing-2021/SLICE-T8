import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    margin: '10px',
    display: 'inline-block'
  },
});

const CardPreview = ({ imgUrl, name }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardMedia
        component="img"
        height="140"
        image={imgUrl}
      />
      <CardContent>
        <p style={{ fontWeight: "700", fontSize: '15px' }}>{name}</p>
      </CardContent>
    </Card>
  );
}

export default CardPreview;
