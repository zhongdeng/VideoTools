//
//  RNFilePicker.m
//  VideoTools-macOS
//
//  Created by 李仲登 on 2024/7/13.
//

#import "RNPathSelector.h"
#import <Cocoa/Cocoa.h>
#import <CommonCrypto/CommonDigest.h>
#import <React/RCTConvert.h>

@implementation RNPathSelector

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(open:(NSDictionary *)option
               resolve:(RCTPromiseResolveBlock)resolve
              rejecter:(RCTPromiseRejectBlock)reject)
{
  BOOL canChooseFiles = [RCTConvert BOOL:option[@"canChooseFiles"]];
  BOOL canChooseDirectories = [RCTConvert BOOL:option[@"canChooseDirectories"]];
  
  dispatch_async(dispatch_get_main_queue(), ^{
    NSOpenPanel *panel = [NSOpenPanel openPanel];
    panel.canChooseFiles = canChooseFiles;
    panel.canChooseDirectories = canChooseDirectories;
    panel.allowsMultipleSelection = NO;
      
    NSInteger result = [panel runModal];
    if (result == NSModalResponseOK) {
        NSURL *selectedDirectory = [panel URL];
        if (selectedDirectory) {
            resolve([selectedDirectory path]);
        } else {
            reject(@"DIRECTORY_ERROR", @"Failed to get the selected directory", nil);
        }
    } else {
        NSError *error = [NSError errorWithDomain:@"RNFilePicker" code:1 userInfo:@{NSLocalizedDescriptionKey: @"User canceled the operation"}];
        reject(@"CANCELLED", @"User canceled the operation", error);
    }
  });
}

RCT_EXPORT_METHOD(execute:(NSString *)scriptPath
                videoPath:(NSString *)videoPath
               targetPath:(NSString *)targetPath
                 callback:(RCTResponseSenderBlock)callback)
{
  NSString *nodePath = @"/Users/dng/.nvm/versions/node/v18.19.0/bin/node";

  NSTask *task = [[NSTask alloc] init];
  [task setLaunchPath:nodePath];
  [task setArguments:@[scriptPath, videoPath, targetPath]];

  NSPipe *pipe = [NSPipe pipe];
  [task setStandardOutput:pipe];

  [task launch];
  [task waitUntilExit];

  NSData *data = [[pipe fileHandleForReading] readDataToEndOfFile];
  NSString *output = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
  
  callback(@[output]);
}

@end

