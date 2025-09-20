## MSG91 OTP Widget (Web SDK) Client Config

Add these envs in `.env.local`:

```
NEXT_PUBLIC_MSG91_WIDGET_ID=your_widget_id
NEXT_PUBLIC_MSG91_TOKEN=your_widget_token
NEXT_PUBLIC_API_URL=http://localhost:5000
```

The login and registration pages automatically use MSG91 custom UI methods when configured; otherwise they fall back to the built-in OTP endpoints. OTP length is 4 digits.
