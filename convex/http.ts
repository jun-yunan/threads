import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { WebhookEvent } from '@clerk/backend';
import { Webhook } from 'svix';
import { internal } from './_generated/api';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';

const http = httpRouter();

const validatePayload = async (
  req: Request,
): Promise<WebhookEvent | undefined> => {
  const payload = await req.text();
  const svixHeaders = {
    'svix-id': req.headers.get('svix-id')!,
    'svix-timestamp': req.headers.get('svix-timestamp')!,
    'svix-signature': req.headers.get('svix-signature')!,
  };

  const webhook = new Webhook('whsec_1BGsbn7nxSjf2oRK/sxiiUcNBpbZzGnJ');

  try {
    const event = webhook.verify(payload, svixHeaders) as WebhookEvent;
    return event;
  } catch (error) {
    console.log('Error verifying webhook', error);
    return;
  }
};

const handlerClerkWebhook = httpAction(async (context, req) => {
  const event = await validatePayload(req);
  if (!event) {
    return new Response('Invalid webhook', { status: 400 });
  }

  switch (event.type) {
    case 'user.created': {
      const user = await context.runQuery(internal.user.get, {
        clerkId: event.data.id,
      });
      if (user) {
        console.log(`Updating user ${event.data.id} with  ${event.data}`);
      }
    }
    case 'user.updated': {
      console.log(`Creating/Updating user: ${event.data.id}`);

      const fullName = `${event.data.first_name} ${event.data.last_name}`;

      const username =
        '@' +
        slugify(fullName, {
          lower: true,
          strict: true,
          replacement: '',
          trim: true,
        }) +
        `${uuidv4().split('-')[0]}`;

      await context.runMutation(internal.user.create, {
        name: fullName,
        username: username,
        imageUrl: event.data.image_url,
        clerkId: event.data.id,
        email: event.data.email_addresses[0].email_address,
        updatedAt: Date.now(),
      });
      break;
    }
    default: {
      console.log(`Clerk webhook event not supported: ${event.type}`);
    }
  }

  return new Response(null, { status: 200 });
});

http.route({
  path: '/clerk-users-webhook',
  method: 'POST',
  handler: handlerClerkWebhook,
});

export default http;
