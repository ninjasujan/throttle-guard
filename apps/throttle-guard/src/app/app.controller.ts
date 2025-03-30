import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class AppController {
  constructor() {
    /**
     * * Constructor for AppController
     * * This controller handles the main application routes.
     * * It provides a simple endpoint to demonstrate the functionality of the application.
     */
  }

  @Get('')
  getData() {
    return {
      message: 'Hello from the app controller!',
      timestamp: new Date().toISOString(),
      status: 'success',
      data: {
        name: 'App Controller',
        description: 'This is a sample controller in a NestJS application.',
        version: '1.0.0',
      },
    };
  }
}
