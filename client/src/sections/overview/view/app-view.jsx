import React from 'react';
import { useNavigate } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';

export default function AppView() {
  const navigate = useNavigate();

  const handleCardClick = (path, empresa) => {
    navigate(path, { state: { empresa } });
  };

  const cardsData = [
    {
      title: 'Record Vacaciones IDSA',
      description: '',
      image: '/logo_idsa.jpg',
      path: '/empleado',
      empresa: 'IDSA'
    },
    {
      title: 'Record Vacaciones UPCO',
      description: '',
      image: '/logo_upco.jpg',
      path: '/empleado',
      empresa: 'UPCO'
    },
    {
      title: 'Record Vacaciones Arrayán',
      description: '',
      image: '/logo_arrayan.jpg',
      path: '/empleado',
      empresa: 'ARRAYAN'
    },
    {
      title: 'Record Vacaciones Durrikikará',
      description: '',
      image: '/logo_durri.jpg',
      path: '/empleado',
      empresa: 'DURRIKIKARA'
    },
    {
      title: 'Record Vacaciones LYNX',
      description: '',
      image: '/logo_lynx.jpg',
      path: '/empleado',
      empresa: 'LYNX'
    },
    {
      title: 'Record Vacaciones FINCASA',
      description: '',
      image: '/logo_fincasa.jpg',
      path: '/empleado',
      empresa: 'FINCASA'
    },
  ];

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hola Buenos dias 👋  ¿Que deseas hacer hoy?
      </Typography>
      <Grid container spacing={4}>
        {cardsData.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ maxWidth: 345 }}>
              <CardActionArea onClick={() => handleCardClick(card.path, card.empresa)}>
                <CardMedia
                  component="img"
                  height={['IDSA', 'FINCASA', 'LYNX'].includes(card.empresa) ? '180' : '180'}
                  image={card.image}
                  alt={card.title}
                  sx={['IDSA', 'FINCASA', 'LYNX'].includes(card.empresa) ? {
                    objectFit: 'contain',
                    padding: '10px',
                    backgroundColor: '#f5f5f5'
                  } : {}}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" component="div">
                    {card.description.split('. ').map((sentence, idx) => (
                      <p key={idx}>{sentence}</p>
                    ))}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}