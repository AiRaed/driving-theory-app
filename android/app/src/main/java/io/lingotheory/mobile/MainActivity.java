package io.lingotheory.mobile;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import io.lingotheory.mobile.billing.PlayBillingPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Register custom plugins BEFORE super.onCreate()
        registerPlugin(PlayBillingPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
