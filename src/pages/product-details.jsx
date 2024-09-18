import React , {useEffect,useState }from 'react';
import { useParams } from 'react-router-dom';
import ApiServices from '../services/api';
import { Stack, Typography, Card, CardContent, Grid } from '@mui/joy';
import parse from 'html-react-parser';
import Chip from '@mui/material/Chip';

const ProductDetails = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState('');

    useEffect(()=> {  
        async function getRecipe() {
            let recipe  = {}
            const res = await ApiServices.getRecipe(id)
            if (res) {    
                recipe = {
                    name : res.title,
                    image : res.image,
                    instructions : res.instructions,
                    ingredients : res.extendedIngredients.map(ingredient => ({
                            id: ingredient.id,
                            name: ingredient.name,
                            measure: [
                                `${ingredient.measures.us.amount} ${ingredient.measures.us.unitShort}`,
                                `${ingredient.measures.metric.amount} ${ingredient.measures.metric.unitShort}`
                            ]
                        }))
                    }
                let healthInfo = []
                for (const key in res) {
                    if (res.hasOwnProperty(key) && res[key]=== true) {
                        healthInfo.push(key);
                    }
                }
                recipe = {...recipe,healthInfo}
            }
            setRecipe(recipe)
        }   
        getRecipe()
    },[id])

    return (
        <div>
            {recipe && 
                <Card
                    color="warning"
                    variant="outlined"
                    sx={{
                        margin: '2rem auto',
                        width : '90%',
                        boxShadow: '5px 5px 5px rgba(0,0,0,0.1)',
                        maxWidth: '1000px'
                    }}
                >
                    <img src={recipe.image} alt={recipe.title} style={{maxWidth: 300, width : "100%"}}/>
                    <CardContent>
                    <Typography
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '2rem',
                        }}
                    >
                        {recipe.name}
                    </Typography><Stack direction='row' spacing={1} flexWrap='wrap'>
                    {Array.from(recipe.healthInfo).length > 0 && Array.from(recipe.healthInfo).map((item,index)=> (
                        <div key={index}><Chip label={item} color="primary" /></div>
                    ))}</Stack>
                    <Typography sx={{fontWeight: 'bold',}}>Ingredients</Typography>
                        {recipe.ingredients.map((item,index)=> (
                            <div key={index}>
                                <Grid container maxWidth={800}>
                                    <Grid item='true' xs={6} md={8}>
                                        <Typography>- {item.name}</Typography>
                                    </Grid>
                                    <Grid item='true' xs={6} md={4}>
                                        <Typography>{item.measure.join('/')}</Typography>
                                    </Grid>
                                </Grid>            
                            </div>
                        ))}
                        <Typography sx={{ fontWeight: 'bold'}}>Instructions</Typography>
                        <Typography> {parse(recipe.instructions)}</Typography>
                    </CardContent>
                </Card>
            }
        </div>
    );
};

export default ProductDetails;
