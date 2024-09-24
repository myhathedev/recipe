import React, { useState, useEffect } from 'react';
import { Input, Button, Stack, Card, CardContent } from '@mui/joy';
import Typography from '@mui/material/Typography';
import { Pagination } from '@mui/material';
import ApiServices from '../services/api';
import AspectRatio from '@mui/joy/AspectRatio';
import Link from '@mui/joy/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import {cuisines} from '../services/data.js';
import { useNavigate ,useLocation } from 'react-router-dom';
import Select from '@mui/material/Select';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

const CUISINES = cuisines
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Home = () => {
    const [keyword, setKeyword] = useState('');
    const [error, setError] = useState('');
    const [noresult, setNoResult] = useState('');
    const [displayKeyword, setDisplayKeyword] = useState('');
    const [result, setResult] = useState([]);
    const [page, setPage] = useState(1);
    const [cuisines, setCuisines] = useState([]);
    const itemsPerPage = 5;
    const navigate = useNavigate();
    const changeKeyword = (e) => setKeyword(e.target.value);
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const keywordParam = searchParams.get('keyword') || '';
        const cuisineParam_raw = searchParams.get('cuisine') 
        let cuisineParam = []
        if (cuisineParam_raw) {
            cuisineParam = cuisineParam_raw.split(',')
        }
        cuisineParam = cuisineParam.filter(item => CUISINES.includes(item));

        if (keywordParam || searchParams.get('cuisine')) {
            async function search() {
                let new_results = [];
                setError('');
                const res = await ApiServices.searchRecipe(keywordParam, cuisineParam);
                if (res.results && Array.from(res.results).length > 0) {
                    new_results = res.results; 
                    setNoResult('');
                } else {
                    setNoResult('No result found.');
                }
                setResult(new_results);
            }
            search();
            setKeyword(keywordParam); 
            setDisplayKeyword(keywordParam);
            setCuisines(cuisineParam);
        }
    }, []); 

    const handleSubmit = async (keyword,cuisines) => {
        if (!keyword) {
            setError('Please enter a keyword.');
            return;
        }
        let new_results = []
        setError('');
        const res = await ApiServices.searchRecipe(keyword,cuisines);
        updateParam('keyword',keyword)
        if (res.results && Array.from(res.results).length > 0 ) {
            new_results = res.results    
            setNoResult('');
        } else {
            setNoResult('No result found.');
        }
         setDisplayKeyword(keyword);
        setResult(new_results); 
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(keyword,cuisines);
        }
    };

    // filter
    const handleChangeCuisine = (event) => {
        const value = event.target.value;
        let newCuisine = []
        if (typeof value === 'string') {
            newCuisine = value.split(',')
        } else {
           newCuisine = value 
        }
        setCuisines(newCuisine)
        updateParam('cuisine',newCuisine)
        if (keyword) {
            handleSubmit(keyword,newCuisine);
        }   
    };

    const updateParam = (paramName, paramValue) => {
        const queryParams = new URLSearchParams(window.location.search);
        if (paramValue !== undefined && paramValue !== null && paramValue !== '') {
            queryParams.set(paramName, paramValue);
        } else {
            queryParams.delete(paramName);
        }
        navigate(`?${queryParams.toString()}`, { replace: true });
    };

    const handlePageChange = (event,value) => setPage(value);

    const ResultStack = ({ result, page }) => {
        const totalPages = Math.ceil(result.length / itemsPerPage);
        const currentItems = result.slice((page - 1) * itemsPerPage, page * itemsPerPage);
        return (
            <Stack
                direction="column"
                spacing={4}
                sx={{ justifyContent: 'center', alignItems: 'center', paddingBottom: '4rem' }}
            >
                <Typography >Found {result.length} result(s).</Typography>
                <List
                    sx={{ display: "flex", flexWrap: 'wrap', justifyContent: 'center' }}
                >
                    {Array.from(currentItems).map((item, index) => (
                        <ListItem  key={index}  sx={{width : "fit-content"}}>
                            <article>
                                <Link  aria-label={item.title} href={`/product-detail/${item.id}?keyword=${keyword}&cuisine=${cuisines.join(',')}`} underline='none' color="warning">
                                    <Card
                                        color="warning"
                                        variant="outlined"
                                        sx={{
                                            width: 230,
                                            margin: '0.5rem',
                                            height: 300,
                                            boxShadow: '5px 5px 5px rgba(0,0,0,0.1)',
                                            transition : 'all 0.3s',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                boxShadow: '10px 10px 15px rgba(0,0,0,0.2)',
                                            }
                                        }}
                                    >
                                        <AspectRatio minHeight="200px" maxHeight="200px">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </AspectRatio>
                                        <CardContent>
                                            <Typography
                                                variant='h2'
                                                sx={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    color: '#72430D',
                                                    width: '100%',
                                                    fontSize: "18px"
                                                }}
                                            >
                                                {item.title}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </article>
                        </ListItem>
                    ))}
                </List>
                <Pagination
                    count={totalPages}
                    variant="outlined"
                    page={page}
                    onChange={handlePageChange}
                />
            </Stack>
        );
    };

    return (
        <> 
        <header>
            <Stack
                direction="column"
                spacing={2}
                sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '2rem 1rem',
                    maxWidth: '600px',
                    margin: 'auto'
                }}
            >
                 <Typography
                    id='main-header'
                    variant="h1"
                    sx={{
                        color: '#9A5B13',
                        fontSize: "2rem"
                    }}
                >
                    Find Your Recipes
                </Typography>
                <form role="search" aria-labelledby="main-header">
                    <Typography id="keyword-help-text" variant="body2" textAlign="center" color="textSecondary">
                        Enter a keyword to search for relevant results.
                    </Typography>
                        <Input
                            color="warning"
                            size="lg"
                            variant="outlined"
                            placeholder="Enter a keyword"
                            aria-label="Keyword search input"
                            aria-describedby="keyword-help-text"
                            value={keyword}
                            onChange={changeKeyword}
                            onKeyDown={handleKeyPress}
                            endDecorator={
                                <Button color="warning" onClick={() =>handleSubmit(keyword,cuisines)}>
                                    Search
                                </Button>
                            }
                        />
                    {error && <div>{error}</div>}
                    <FormControl sx={{ m: 1, width: 300 , marginTop : 4 }}>  
                        <InputLabel id="cusine-label">Select Cuisines</InputLabel>
                        <Select
                            labelId="cusine-label"
                            id="cuisine-select"
                            multiple
                            style = {{borderColor : "#9A5B13"}}
                            value={cuisines}
                            onChange={handleChangeCuisine}
                            input={<OutlinedInput label="Select Cuisines" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                            sx={{
                                boxShadow : "0px 1px 2px 0px rgba(0,0,0, 0.08)",
                                backgroundColor: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#F3C896', 
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#9A5B13', 
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#9A5B13',
                                },
                            }}
                        >
                    {CUISINES.map((name) => (
                        <MenuItem key={name} value={name}>
                        <Checkbox checked={cuisines.includes(name)} />
                        <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
                </FormControl>
                </form>
            </Stack>
            </header>
            <main>
                {displayKeyword && (
                <>
                <Typography
                    variant='subtitle1'
                    sx={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        width: '100%'
                    }}
                >
                    Keyword: {displayKeyword}
                </Typography>
                {cuisines.length> 0 && 
                    <Typography
                        variant='subtitle1'
                        sx={{
                            textAlign: 'center',
                            width: '100%'
                        }}
                    >
                        {cuisines.join(', ')}
                    </Typography>}
                </>
            )}
                {noresult && 
                    <Typography
                        variant='body2'
                        sx={{
                            textAlign: 'center',
                            width: '100%'
                        }}
                    >
                        {noresult}
                    </Typography>}

                {result.length > 0 && 
                <ResultStack result = {result} page={page} setPage={setPage} />
                }
            </main>

            
        </>
    );
};

export default Home;
