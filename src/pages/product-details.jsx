import React , {useEffect,useState,useRef }from 'react';
import { useParams } from 'react-router-dom';
import ApiServices from '../services/api';
import { Button, Card, CardContent, Grid } from '@mui/joy';
import parse from 'html-react-parser';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import { useNavigate ,useLocation } from 'react-router-dom';
import LocalPrintshopRoundedIcon from '@mui/icons-material/LocalPrintshopRounded';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import CircularProgress from '@mui/material/CircularProgress';

const ProductDetails = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading,setIsLoading] = useState(true)

    useEffect(()=> {  
        async function getRecipe() {
            let recipe  = {}
            const res = await ApiServices.getRecipe(id)
            if (res) {    
                recipe = {
                    name : res.title || '',
                    image : res.image || '',
                    diets : (Array.from(res.diets||[])),
                    instructions : res.instructions || '',
                    ingredients : Array.from(res.extendedIngredients||[]).map(ingredient => ({
                            id: ingredient.id,
                            name: ingredient.name,
                            measure: [
                                `${ingredient.measures.us.amount} ${ingredient.measures.us.unitShort}`,
                                `${ingredient.measures.metric.amount} ${ingredient.measures.metric.unitShort}`
                            ]
                        }))
                    }
            }
            setRecipe(recipe)
            setIsLoading(false)
        }   
        getRecipe()
    },[id])

    const handleClickHome = () => {
        const searchParams = new URLSearchParams(location.search);
        navigate(`/?${searchParams.toString()}`);
    };
    const cardRef = useRef();

    const printRecipe = () => {
    const printContents = cardRef.current.innerHTML;
    const originalStyles = Array.from(document.styleSheets)
        .map(styleSheet => {
            try {
                return Array.from(styleSheet.cssRules)
                    .map(rule => rule.cssText)
                    .join('');
            } catch (e) {
                return '';
            }
        })
        .join('');

        const newWindow = window.open('', '', 'height=600,width=800');
        newWindow.document.write('<style>' + originalStyles + '</style>');
        newWindow.document.write(printContents);
        newWindow.document.close();
        newWindow.print();
        newWindow.close();
    }

    return (
    <>
    
        <Stack  direction='row' 
                justifyContent="space-between"
                
                sx={{
                    margin: '1rem auto',
                    width : '90%',
                    maxWidth: '1000px'
                }} >
                <nav>
                     <Button 
                        variant="plain"
                        color="warning" 
                        onClick={handleClickHome}
                        startDecorator={<ArrowBackIosRoundedIcon fontSize='small'/>}
                    >
                    Home Page
                    </Button>          
                </nav>
           
            <Button 
                variant="plain"
                color="warning" 
                onClick={printRecipe}
                startDecorator={<LocalPrintshopRoundedIcon fontSize='small'/>}
            >
                Print
            </Button>
        </Stack>  
          <Card
                    ref={cardRef}
                    variant="outlined"
                    color="warning"
                    sx={{
                        margin: '2% auto',
                        width : '90%',
                        boxShadow: '5px 5px 5px rgba(0,0,0,0.1)',
                        maxWidth: '1000px'
                    }}
                >       
        {isLoading? <Typography variant='body1' textAlign="center" marginTop={20}> <CircularProgress/> Loading ...</Typography> :  
        <>
            {Object.keys(recipe).length> 0 ?       
              <>
                    <header>      
                        <Grid container='true' spacing={2} marginBottom={2}   
                                sx={{
                                    textAlign: {
                                        xs: 'center', 
                                        md: 'left',
                                    }
                                }} >
                            <Grid item='true' xs={12} md={8} alignSelf={"end"}>
                                <Typography id="recipe-title" variant='h1' fontSize={32} color='warning' gutterBottom>
                                    {recipe.name}
                                </Typography>
                                <List role="region" aria-label="Diet tags" style={{ display: 'flex', flexWrap: 'wrap', padding: 0, listStyle: 'none', gap: "0.5rem" }}>
                                    {Array.from(recipe.diets).length > 0 && Array.from(recipe.diets).map((item, index) => (
                                        <ListItem key={index} style={{ width : "fit-content", padding : 0 }}>
                                            <Chip label={item} color="primary" style={{ textTransform: "capitalize" }} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                            <Grid item='true' xs={12} md={4}>
                                <img src={recipe.image} alt={recipe.title} style={{ width: "100%", maxWidth:"400px", borderRadius: 10}} />
                            </Grid>
                        </Grid>   
                    </header> 
                    <main aria-labelledby="recipe-title">
                    <CardContent>
                        <div role="region" aria-labelledby="ingredient-heading">
                            <Typography id='ingredient-heading'  variant="h2"  fontSize={24}>Ingredients</Typography>
                            <List>
                            {recipe.ingredients.map((item,index)=> (
                                <ListItem key={index}>
                                    <Grid container='true' maxWidth={800} width={"100%"}>
                                        <Grid item='true' xs={6} md={8}>
                                            <Typography variant="body1"color='black' style={{textTransform : "capitalize"}}>{item.name}</Typography>
                                        </Grid>
                                        <Grid item='true' xs={6} md={4}>
                                            <Typography color='black' variant="body1">{item.measure.join('/')}</Typography>
                                        </Grid>
                                    </Grid>    
                                </ListItem>               
                                ))}
                            </List>                       
                        </div>
                        <div role="region" aria-labelledby="instruction-heading">
                            <Typography variant="h2" id='instruction-heading'  fontSize={24}>Instructions</Typography>
                            <Stack color='black'>{parse(recipe.instructions)}</Stack> 
                        </div>        
                    </CardContent>
                    </main>
                </> : <Typography variant="h2"  fontSize={18} textAlign="center" marginTop={10} marginBottom={10}>There is no result, please go back to home page.</Typography>
            }</>
        }
        </Card>
    </>
    );
};

export default ProductDetails;
