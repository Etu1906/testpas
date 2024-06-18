import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import React, { useEffect, useState } from 'react';
import {  IonHeader, IonTitle, IonToolbar, IonContent, IonButton, IonText } from '@ionic/react';
import { Pedometer } from '@ionic-native/pedometer';
import { Plugins } from '@capacitor/core';

setupIonicReact();

const App: React.FC = () => {
  
const { Device } = Plugins;
const [stepCount, setStepCount] = useState(0);
const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);

useEffect(() => {
  const checkPedometerAvailability = async () => {
    const info = await Device.getInfo();
    if (info.platform !== 'web') {
      Pedometer.isStepCountingAvailable()
        .then((available) => {
          setIsPedometerAvailable(available);
        })
        .catch((error) => {
          console.error('Pedometer not available:', error);
        });
    }
  };
  checkPedometerAvailability();
}, []);

const startStepCounting = () => {
  Pedometer.startPedometerUpdates()
    .subscribe((data) => {
      setStepCount(data.numberOfSteps);
    });
};


  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Compteur de pas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {isPedometerAvailable ? (
          <>
            <IonButton onClick={startStepCounting}>Démarrer le comptage des pas</IonButton>
            <IonText>
              <h2>Nombre de pas : {stepCount}</h2>
            </IonText>
          </>
        ) : (
          <IonText>
            <h2>Le pédomètre n'est pas disponible sur cet appareil.</h2>
          </IonText>
        )}
      </IonContent>
    </IonApp>
  );
};


export default App;
