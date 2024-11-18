import React from 'react'
import { Card, CardContent, Grid, Typography } from '@mui/material'

export default function Value() {
    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                    <Card className="rounded-md shadow-md">
                        <CardContent className="text-center">
                            <Typography variant="h5" className="font-semibold">
                                Active
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#f16529' }}>
                                12
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Card className="rounded-md shadow-md">
                        <CardContent className="text-center">
                            <Typography variant="h5" className="font-semibold">
                                Expired
                            </Typography>
                            <Typography variant="h6" color="error">
                                3
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Card className="rounded-md shadow-md">
                        <CardContent className="text-center">
                            <Typography variant="h5" className="font-semibold">
                                Expired
                            </Typography>
                            <Typography variant="h6" color="error">
                                3
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Card className="rounded-md shadow-md">
                        <CardContent className="text-center">
                            <Typography variant="h5" className="font-semibold">
                                Expired
                            </Typography>
                            <Typography variant="h6" color="error">
                                3
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>

        
)
}
